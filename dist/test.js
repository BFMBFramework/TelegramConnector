"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./lib/connection");
let testConnection = new connection_1.TelegramConnection(process.env.TELEGRAM_TOKEN);
testConnection.getMe(function (err, user) {
    if (err) {
        console.log(err);
    }
    console.log(user);
});
testConnection.getUpdates({ offset: 267885263, timeout: 15 }, function (err, response) {
    if (err) {
        console.log(err);
    }
    console.log(response);
    for (let update of response) {
        if (update.message.text === "Nice meme") {
            testConnection.sendMessage({ chat_id: update.message.chat.id, text: "Thanks hue hue" }, function (err, response) {
                if (err) {
                    console.log(err);
                }
                console.log(response);
            });
        }
    }
});
