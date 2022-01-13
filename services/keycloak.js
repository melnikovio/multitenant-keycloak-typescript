"use strict";
exports.__esModule = true;
exports.KeycloakService = void 0;
var keycloak_js_1 = require("keycloak-js");
var KeycloakService = /** @class */ (function () {
    function KeycloakService() {
        this.Tenant1Config = {
            url: "http://192.168.100.56:8080/auth",
            realm: "Tenant1",
            clientId: "portal"
        };
        this.Tenant2Config = {
            url: "http://192.168.100.56:8080/auth",
            realm: "Tenant2",
            clientId: "portal"
        };
        this.kcInstance1 = (0, keycloak_js_1["default"])({
            clientId: this.Tenant1Config.clientId,
            realm: this.Tenant1Config.realm,
            url: this.Tenant1Config.url
        });
        this.kcInstance2 = (0, keycloak_js_1["default"])({
            clientId: this.Tenant2Config.clientId,
            realm: this.Tenant2Config.realm,
            url: this.Tenant2Config.url
        });
    }
    ;
    KeycloakService.prototype.login = function () {
        console.log("login");
        this.kcInstance1.login();
    };
    return KeycloakService;
}());
exports.KeycloakService = KeycloakService;
