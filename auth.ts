import { KeycloakService } from "./services/keycloak";
import fetch from 'node-fetch';


interface TenantConfig {
  url: string;
  realm: string;
  clientId: string;
}

const getRuntimeConfig = async () => {
  const runtimeConfig = await fetch('./config.json');
  return await runtimeConfig.json()
}

load();


let Config: TenantConfig[]

class AdminTS {
  constructor() {



    document.getElementById("tenant1_login").addEventListener("click", Event => login_tenant1());

    document.getElementById("tenant2_login").addEventListener("click", Event => login_tenant2());

    document.getElementById("tenant1_logout").addEventListener("click", Event => logout_tenant1());

   
    document.getElementById("tenant2_logout").addEventListener("click", Event => logout_tenant2());

    document.getElementById("profile_tenant1")?.addEventListener("click", Event => profile_tenant1());

    document.getElementById("profile_tenant2")?.addEventListener("click", Event => profile_tenant2());

    document.getElementById("tenant1_request_tenant1")?.addEventListener("click", Event => tenant1_request_tenant1())

    document.getElementById("tenant1_request_tenant2")?.addEventListener("click", Event => tenant1_request_tenant2())
      

    document.getElementById("tenant2_request_tenant1")?.addEventListener("click", Event => tenant2_request_tenant1())

    document.getElementById("tenant2_request_tenant2")?.addEventListener("click", Event => tenant2_request_tenant2())
  }
}

// start the app
new AdminTS();


let KS1: KeycloakService
let KS2: KeycloakService
  
async function load() {
  console.log("load");

  getRuntimeConfig().then(function(json) {
    Config = json as TenantConfig[]
    let Tenant1Config = Config[0]
    let Tenant2Config = Config[1]

    KS1 = new KeycloakService(Tenant1Config.clientId, Tenant1Config.realm, Tenant1Config.url, "tenant1");

  
    // await new Promise(f => setTimeout(f, 2000));

    KS2 = new KeycloakService(Tenant2Config.clientId, Tenant2Config.realm, Tenant2Config.url, "tenant2");

    console.log("loaded")

    // debugger
    // await new Promise(f => setTimeout(f, 2000));

    login()

    // debugger
  });


  
}

// debugger

function profile_tenant1() {
  KS1.profile("tenant1");
}

function profile_tenant2() {
  KS2.profile("tenant2");
}

function login_tenant1() {
  KS1.login();
}

function login_tenant2() {
  KS2.login();
}

function logout_tenant1() {
  KS1.logout();
}

function logout_tenant2() {
  KS2.logout();
}

function login() {
  console.log("login")

  if (!KS1.KcInstance.authenticated) {
      console.log("kcInstance1: not authenticated!")
      document.getElementById("tenant1_status").textContent = "Not authenticated"
      document.getElementById("tenant1_status").style.color = "#FF0000";
      //KS1.KcInstance.login()
  } else {
      console.log("kcInstance1: authenticated")
      document.getElementById("tenant1_status").textContent = "Authenticated"
      document.getElementById("tenant1_status").style.color = "#228B22";
      KS1.profile("tenant1");
  }

  if (!KS2.KcInstance.authenticated) {
      console.log("kcInstance2: not authenticated!")
      document.getElementById("tenant2_status").textContent = "Not authenticated"
      document.getElementById("tenant2_status").style.color = "#FF0000";


      //KS2.KcInstance.login()
  } else {
      console.log("kcInstance2: authenticated")
      document.getElementById("tenant2_status").textContent = "Authenticated"
      document.getElementById("tenant2_status").style.color = "#228B22";
      KS2.profile("tenant2");
  }
}

async function tenant1_request_tenant1() {
  fetch("https://ziiot-qa02.apps.okd01.ziiot.ru/auth/realms/tenant1/account", {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KS1.KcInstance.token} 
  }).then(response => {
    if (response.ok) {
      // response.json().then((data) => {
      //   console.log(data);
      // });  
      document.getElementById("tenant1_request_tenant1_result").textContent = "Success"
      document.getElementById("tenant1_request_tenant1_result").style.color = "#228B22";
    } else {
      throw 'There is something wrong';
    }
  }).
  catch(error => {
      console.log(error);
      document.getElementById("tenant1_request_tenant1_result").textContent = "Not authenticated"
      document.getElementById("tenant1_request_tenant1_result").style.color = "#FF0000";

  });



  // if (!response.ok) 
  // { 
  //   console.log("error")
  //     console.error("Error");
  // }
  // else if (response.statusCode == 401) {
  //    document.getElementById("tenant1_request_tenant1_result").textContent = "Not authenticated"
  // }
  // else if (response.statusCode >= 401) {
  //   console.log("error")

  //     console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage);
  // }
  // else{
  //     //onSuccess();
  //     document.getElementById("tenant1_request_tenant1_result").textContent = "Success"

      
  //     console.log("success")
  // }

  //const data = await response.json();


  //console.log(data);  
}

async function tenant1_request_tenant2() {
  fetch("https://ziiot-qa02.apps.okd01.ziiot.ru/auth/realms/tenant2/account", {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KS1.KcInstance.token} 
  }).then(response => {
    if (response.ok) {
      document.getElementById("tenant1_request_tenant2_result").textContent = "Success"
      document.getElementById("tenant1_request_tenant2_result").style.color = "#228B22";
    } else {
      throw 'There is something wrong';
    }
  }).
  catch(error => {
      console.log(error);
      document.getElementById("tenant1_request_tenant2_result").textContent = "Not authenticated"
      document.getElementById("tenant1_request_tenant2_result").style.color = "#FF0000";

  }); 
}

async function tenant2_request_tenant1() {
  fetch("https://ziiot-qa02.apps.okd01.ziiot.ru/auth/realms/tenant1/account", {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KS2.KcInstance.token} 
  }).then(response => {
    if (response.ok) {
      document.getElementById("tenant2_request_tenant1_result").textContent = "Success"
      document.getElementById("tenant2_request_tenant1_result").style.color = "#228B22";

    } else {
      throw 'There is something wrong';
    }
  }).
  catch(error => {
      console.log(error);
      document.getElementById("tenant2_request_tenant1_result").textContent = "Not authenticated"
      document.getElementById("tenant2_request_tenant1_result").style.color = "#FF0000";

  }); 
}

async function tenant2_request_tenant2() {
  fetch("https://ziiot-qa02.apps.okd01.ziiot.ru/auth/realms/tenant2/account", {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KS2.KcInstance.token} 
  }).then(response => {
    if (response.ok) {
      document.getElementById("tenant2_request_tenant2_result").textContent = "Success"
      document.getElementById("tenant2_request_tenant2_result").style.color = "#228B22";

    } else {
      throw 'There is something wrong';
    }
  }).
  catch(error => {
      console.log(error);
      document.getElementById("tenant2_request_tenant2_result").textContent = "Not authenticated"
      document.getElementById("tenant2_request_tenant2_result").style.color = "#FF0000";

  }); 
}