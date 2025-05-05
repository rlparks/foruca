import { env } from "$env/dynamic/private";

type AuthInfo = {
	authEndpoint: string;
	tokenEndpoint: string;
	userinfoEndpoint: string;
	endSessionEndpoint: string;
	state: string;
};

const SCOPES = ["openid", "profile"] as const;

let authInfo: AuthInfo | undefined = undefined;

export async function getAuthInfo(state: string) {
	if (authInfo) {
		return authInfo;
	}

	const oidcDiscoveryUrl = env.OIDC_DISCOVERY_URL;
	const clientId = env.OIDC_CLIENT_ID;
	if (!oidcDiscoveryUrl || !clientId) {
		throw new Error("OIDC_DISCOVERY_URL or OIDC_CLIENT_ID is not set");
	}

	const discoveryResponse = await fetch(oidcDiscoveryUrl);

	const endpoints = await validateDiscoveryResponse(discoveryResponse);

	const authEndpoint = setAuthEndpointParams(endpoints.authEndpoint, clientId, state);

	authInfo = {
		authEndpoint,
		tokenEndpoint: endpoints.tokenEndpoint,
		userinfoEndpoint: endpoints.userinfoEndpoint,
		endSessionEndpoint: endpoints.endSessionEndpoint,
		state,
	};

	return authInfo;
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
