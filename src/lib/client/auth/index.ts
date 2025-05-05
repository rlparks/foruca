import { OIDC_STATE_KEY } from "$lib";
import type { AuthInfo } from "$lib/types";

/**
 * Redirects to the OIDC provider to login.
 * Gives an alert if parameters are missing.
 */
function performRedirect(
	authInfo: { state: string } & AuthInfo,
	oidcRedirectUrl: string | undefined,
) {
	if (authInfo.authEndpoint && oidcRedirectUrl) {
		window.sessionStorage.setItem(OIDC_STATE_KEY, authInfo.state);

		const authEndpointUrl = new URL(authInfo.authEndpoint);
		authEndpointUrl.searchParams.set("redirect_uri", oidcRedirectUrl);
		window.location.href = authEndpointUrl.toString();
	} else {
		alert("Error: Provider not found.");
	}
}
