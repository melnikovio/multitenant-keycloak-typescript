import Keycloak, { KeycloakInstance } from 'keycloak-js';
export class KeycloakService {
    public KcInstance: Keycloak.KeycloakInstance;
 
    constructor(clientId: string, realm: string, url: string, tenant: string) {
        console.log("loading " + realm)

        document.getElementById(tenant + "_url").textContent = url
        document.getElementById(tenant + "_realm").textContent = realm
        document.getElementById(tenant + "_client").textContent = clientId

        let kk = Keycloak({
            clientId: clientId,
            realm: realm,
            url: url,
        });
        this.KcInstance = kk

        this.KcInstance.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            silentCheckSsoFallback: false
        }).then(function(authenticated) {
            console.log(tenant + " " + realm + authenticated ? ' authenticated' : ' not authenticated');
            if (authenticated) {
                document.getElementById(tenant + "_status").textContent = "Authenticated"
                document.getElementById(tenant + "_status").style.color = "#228B22";
                fillProfile(tenant, kk);
            } else {
                document.getElementById(tenant + "_status").textContent = "Not authenticated"
                document.getElementById(tenant + "_status").style.color = "#FF0000";
                // autologin
                //tc.login()
            }
        }).catch(function() {
            console.log(realm + ' failed to initialize');
            // workaround about callback
            var hash = window.location.hash.substr(1);
            if (hash == "refreshme=true") {
                window.location.replace(window.location.origin);
            }
        });
    };

    login() {
        this.KcInstance.login({
             redirectUri: window.location.origin + '/assets/redirect.html' + "#redirecturl=" + window.location.origin + window.location.pathname
        });
    }

    logout() {
        this.KcInstance.logout({
             //redirectUri: window.location.origin + '/assets/redirect.html'
        });
    }

    profile(tenant: string) {
        fillProfile(tenant, this.KcInstance);
    }
}


async function fillProfile(tenant: string, keycloak: KeycloakInstance) {
    let profile = await keycloak.loadUserProfile()

    document.getElementById(tenant + "_username").textContent = profile.username
    document.getElementById(tenant + "_firstname").textContent = profile.firstName
    document.getElementById(tenant + "_lastname").textContent = profile.lastName
    document.getElementById(tenant + "_email").textContent = profile.email
}