import { env } from "$env/dynamic/private";
import type { AuthInfo } from "$lib/types";

const SCOPES = ["openid", "profile"] as const;

let authInfo: AuthInfo | undefined = undefined;

export async function getAuthInfo(state: string) {
	const clientId = env.OIDC_CLIENT_ID;
	if (authInfo) {
		const authEndpoint = setAuthEndpointParams(authInfo.authEndpoint, clientId, state);
		return { ...authInfo, authEndpoint, state };
	}

	const oidcDiscoveryUrl = env.OIDC_DISCOVERY_URL;
	if (!oidcDiscoveryUrl || !clientId) {
		throw new Error("OIDC_DISCOVERY_URL or OIDC_CLIENT_ID is not set");
	}

	const discoveryResponse = await fetch(oidcDiscoveryUrl);

	const endpoints = await validateDiscoveryResponse(discoveryResponse);

	authInfo = {
		authEndpoint: endpoints.authEndpoint,
		tokenEndpoint: endpoints.tokenEndpoint,
		userinfoEndpoint: endpoints.userinfoEndpoint,
		endSessionEndpoint: endpoints.endSessionEndpoint,
	};

	const authEndpoint = setAuthEndpointParams(authInfo.authEndpoint, clientId, state);
	return { ...authInfo, authEndpoint, state };
}

function setAuthEndpointParams(authEndpoint: string, clientId: string, state: string) {
	const authEndpointUrl = new URL(authEndpoint);
	authEndpointUrl.searchParams.set("response_type", "code");
	authEndpointUrl.searchParams.set("scope", SCOPES.join(" "));
	authEndpointUrl.searchParams.set("client_id", clientId);
	authEndpointUrl.searchParams.set("state", state);
	return authEndpointUrl.toString();
}

async function validateDiscoveryResponse(discoveryResponse: Response) {
	if (!discoveryResponse.ok) {
		throw new Error(`Error retrieving auth provider info: ${discoveryResponse.statusText}`);
	}

	const json = await discoveryResponse.json();
	if (
		!json.authorization_endpoint ||
		!json.token_endpoint ||
		!json.userinfo_endpoint ||
		!json.end_session_endpoint
	) {
		throw new Error("Incomplete discovery response");
	}

	return {
		authEndpoint: String(json.authorization_endpoint),
		tokenEndpoint: String(json.token_endpoint),
		userinfoEndpoint: String(json.userinfo_endpoint),
		endSessionEndpoint: String(json.end_session_endpoint),
	};
}
