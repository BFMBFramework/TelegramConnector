"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const bfmb_base_connector_1 = require("bfmb-base-connector");
const user_1 = require("./user");
exports.TELEGRAM_URL = "https://api.telegram.org/";
class TelegramConnection extends bfmb_base_connector_1.Connection {
    constructor(options) {
        super(options);
        this.token = options.token;
        this.last_update_id = 0;
    }
    getMe(callback) {
        if (this.user) {
            return callback(null, this.user);
        }
        request.get({ url: exports.TELEGRAM_URL + "bot" + this.token + "/getMe" }, (err, r, body) => {
            const response = JSON.parse(body).result;
            if (err)
                return callback(err);
            if (!response)
                return callback(new Error("No response received."));
            this.user = new user_1.TelegramUser(response);
            callback(null, this.user);
        });
    }
    getUpdates(options = {}, callback) {
        if (!options.offset)
            options.offset = this.last_update_id + 1;
        if (!options.timeout)
            options.timeout = 15;
        request.get({ url: exports.TELEGRAM_URL + "bot" + this.token + "/getUpdates", formData: options }, (err, r, body) => {
            const response = JSON.parse(body).result;
            console.log(response);
            if (err)
                return callback(err);
            if (!response)
                return callback(new Error("No response received."));
            this.last_update_id = response[response.length - 1].update_id;
            callback(null, response);
        });
    }
    sendMessage(options = {}, callback) {
        if (!options.chat_id)
            return callback(new Error("Parameter chat_id is required in Telegram API."));
        if (!options.text)
            return callback(new Error("Parameter text is required in Telegram API."));
        request.post({ url: exports.TELEGRAM_URL + "bot" + this.token + "/sendMessage", formData: options }, (err, r, body) => {
            const response = JSON.parse(body).result;
            if (err)
                return callback(err);
            if (!response)
                return callback(new Error("No response received."));
            callback(null, response);
        });
    }
}
exports.TelegramConnection = TelegramConnection;
