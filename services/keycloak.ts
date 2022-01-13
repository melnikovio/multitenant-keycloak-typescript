import { debug } from 'console';
import Keycloak, { KeycloakInstance } from 'keycloak-js';



export class KeycloakService {
    public KcInstance: Keycloak.KeycloakInstance;
    // private kcInstance2: Keycloak.KeycloakInstance;

    constructor(clientId: string, realm: string, url: string, tenant: string) {
        console.log("loading " + realm)

        document.getElementById(tenant + "_url").textContent = url
        document.getElementById(tenant + "_realm").textContent = realm
        document.getElementById(tenant + "_client").textContent = clientId


        this.KcInstance = Keycloak({
            clientId: clientId,
            realm: realm,
            url: url,
        });

        this.KcInstance.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            silentCheckSsoFallback: false
        }).then(function(authenticated) {
            console.log(authenticated ? realm + ' authenticated' : realm + ' not authenticated');
        }).catch(function() {
            console.log(realm + ' failed to initialize');
            var hash = window.location.hash.substr(1);
            if (hash == "refreshme=true") {

                window.location.replace(window.location.origin);

            }
            // debugger
            // var result = hash.split('&').reduce(function (res, item) {
            //     var parts = item.split('=');
            //     res[parts[0]] = parts[1];
            //     return res;
            // }, {});
        });

        // this.kcInstance2 = Keycloak({
        //     clientId: this.Tenant2Config.clientId,
        //     realm: this.Tenant2Config.realm,
        //     url: this.Tenant2Config.url,
        // });

        // this.kcInstance2.init({
        //     onLoad: 'check-sso',
        //     silentCheckSsoRedirectUri: window.location.origin
        // }).then(function(authenticated) {
        //     alert(authenticated ? 'kcInstance2 authenticated' : 'kcInstance2 not authenticated');
        // }).catch(function() {
        //     debugger
        //     alert('kcInstance2 failed to initialize');
        // });

        
    };

    login() {
        this.KcInstance.login({
             redirectUri: window.location.origin + '/assets/redirect.html'
        });
    }

    logout() {
        this.KcInstance.logout({
             //redirectUri: window.location.origin + '/assets/redirect.html'
        });
    }

    profile(tenant: string) {
        fill(tenant, this.KcInstance);
    }

    // initKeycloak(keycloak: KeycloakInstance) {
    //     return () =>
    //       keycloak.init({
    //         onLoad: 'check-sso',
    //         silentCheckSsoRedirectUri: window.location.origin
    //     });
    // }
}

async function fill(tenant: string, keycloak: KeycloakInstance) {

    let profile = await keycloak.loadUserProfile()

    document.getElementById(tenant + "_username").textContent = profile.username
    document.getElementById(tenant + "_firstname").textContent = profile.firstName
    document.getElementById(tenant + "_lastname").textContent = profile.lastName
    document.getElementById(tenant + "_email").textContent = profile.email


}