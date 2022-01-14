import { KeycloakService } from "./services/keycloak";
import fetch from 'node-fetch';

interface TenantConfig {
  url: string;
  realm: string;
  clientId: string;
}

interface Tenant {
  name: string;
  config: TenantConfig;
  keycloakService: KeycloakService;
}

interface Tenants {
  [key: string]: Tenant;
}

const getRuntimeConfig = async () => {
  const runtimeConfig = await fetch('./config.json');
  return await runtimeConfig.json()
}

load();

let Config: TenantConfig[]

class AdminTS {
  constructor() {
    document.getElementById("tenant1_login")?.addEventListener("click", Event => login("tenant1"));
    document.getElementById("tenant2_login")?.addEventListener("click", Event => login("tenant2"));
    document.getElementById("tenant1_logout")?.addEventListener("click", Event => logout("tenant1"));  
    document.getElementById("tenant2_logout")?.addEventListener("click", Event => logout("tenant2"));
    document.getElementById("profile_tenant1")?.addEventListener("click", Event => profile("tenant1"));
    document.getElementById("profile_tenant2")?.addEventListener("click", Event => profile("tenant2"));
    document.getElementById("tenant1_request_tenant1")?.addEventListener("click", Event => request("tenant1", "tenant1"))
    document.getElementById("tenant1_request_tenant2")?.addEventListener("click", Event => request("tenant1", "tenant2"))
    document.getElementById("tenant2_request_tenant1")?.addEventListener("click", Event => request("tenant2", "tenant1"))
    document.getElementById("tenant2_request_tenant2")?.addEventListener("click", Event => request("tenant2", "tenant2"))
  }
}

// start the app
new AdminTS();

let MyTenants: Tenants = {};

  
async function load() {
  console.log("loading");

  getRuntimeConfig().then(function(json) {
    Config = json as TenantConfig[]
    let Tenant1Config = Config[0]
    let Tenant2Config = Config[1]

    let KS1 = new KeycloakService(Tenant1Config.clientId, Tenant1Config.realm, Tenant1Config.url, "tenant1");
    let KS2 = new KeycloakService(Tenant2Config.clientId, Tenant2Config.realm, Tenant2Config.url, "tenant2");

    MyTenants["tenant1"] = {
      name: "tenant1",
      config: Tenant1Config,
      keycloakService: KS1
    }

    MyTenants["tenant2"] = {
      name: "tenant2",
      config: Tenant2Config,
      keycloakService: KS2
    }

    console.log("loaded")
  }); 
}

function profile(tenant: string) {
  MyTenants[tenant].keycloakService.profile(tenant);
}

function login(tenant: string) {
  MyTenants[tenant].keycloakService.login();
}

function logout(tenant: string) {
  MyTenants[tenant].keycloakService.logout();
}


async function request(authTenant: string, requestTenant: string) {
  fetch(MyTenants[requestTenant].config.url + "realms/" + MyTenants[requestTenant].config.realm + "/account", {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + MyTenants[authTenant].keycloakService.KcInstance.token} 
  }).then(response => {
    let resultElement = document.getElementById(authTenant + "_request_" + requestTenant + "_result")
    if (response.ok) {
      resultElement.textContent = "Success"
      resultElement.style.color = "#228B22";
    } else {
      throw 'There is something wrong';
    }
  }).
  catch(error => {
      console.log(error);
      let resultElement = document.getElementById(authTenant + "_request_" + requestTenant + "_result")

      resultElement.textContent = "Not authenticated"
      resultElement.style.color = "#FF0000";
  });
}