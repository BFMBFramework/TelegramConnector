"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = require("./lib/connection");
var testConnection = new connection_1.TelegramConnection("521610674:AAEJA6es-CkKtaAJWIdQwNP_M-vA5TL6kdA");
testConnection.setUserFromNet(function (err, user) {
    if (err) {
        console.log(err);
    }
    console.log(user);
});
