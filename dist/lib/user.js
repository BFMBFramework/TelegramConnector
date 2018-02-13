"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TelegramUser {
    constructor(objData) {
        this.id = objData.id;
        this.is_bot = objData.is_bot;
        this.first_name = objData.first_name;
        this.last_name = objData.last_name;
        this.username = objData.username;
        this.language_code = objData.language_code;
    }
}
exports.TelegramUser = TelegramUser;
