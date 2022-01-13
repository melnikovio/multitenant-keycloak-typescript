"use strict";
exports.__esModule = true;
var keycloak_1 = require("./services/keycloak");
//// <reference path="./services/keycloak.ts" />
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "111Hello, " + person.firstName + " " + person.lastName;
}
var user = new Student("Jane", "M.", "User");
document.body.textContent = greeter(user);
load();
function load() {
    console.log("load");
    var kc = new keycloak_1.KeycloakService();
}
