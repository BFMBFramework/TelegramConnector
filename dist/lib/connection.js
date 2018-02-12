"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var user_1 = require("./user");
var TelegramConnection = /** @class */ (function () {
    function TelegramConnection(token) {
        this.token = token;
    }
    TelegramConnection.prototype.setUserFromNet = function (callback) {
        var _this = this;
        request("https://api.telegram.org/bot" + this.token + "/getMe", function (err, r, body) {
            var response = JSON.parse(body).result;
            if (err) {
                callback(err);
                return;
            }
            if (!response) {
                callback(new Error("No response."));
                return;
            }
            _this.user = new user_1.TelegramUser(response);
            callback(null, _this.user);
        });
    };
    return TelegramConnection;
}());
exports.TelegramConnection = TelegramConnection;
