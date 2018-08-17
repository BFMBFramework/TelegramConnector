"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bfmb_base_connector_1 = require("bfmb-base-connector");
const TelegramBot = require("node-telegram-bot-api");
class TelegramConnector extends bfmb_base_connector_1.Connector {
    constructor() {
        super("Telegram");
    }
    addConnection(options, callback) {
        const self = this;
        const connection = new TelegramConnection(options);
        connection.getBot().getMe().then(function (user) {
            self.connections.push(connection);
            callback(null, connection.getId());
        })
            .catch(function (err) {
            callback(err);
        });
    }
    receiveMessage(id, options = {}, callback) {
        const connection = this.getConnection(id);
        if (connection) {
            options = this.getUpdateOffset(connection, options);
            connection.getBot().getUpdates(options).then(function (response) {
                connection.setOffsetUpdateId(this.parseUpdateOffset(response));
                callback(null, response);
            })
                .catch(function (err) {
                callback(err);
            });
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
    getUpdateOffset(connection, options) {
        if (!options.offset)
            options.offset = connection.getOffsetUpdateId() + 1;
        return options;
    }
    parseUpdateOffset(response) {
        let updateId;
        if (!response || response.length > 0) {
            updateId = response[response.length - 1].update_id;
        }
        else {
            updateId = 0;
        }
        return updateId;
    }
    sendMessage(id, options = {}, callback) {
        const connection = this.getConnection(id);
        const optionsError = this.verifySendMessageOptions(options);
        if (connection && !optionsError) {
            connection.getBot().sendMessage(options.chat_id, options.text, options.params)
                .then(function (message) {
                callback(null, message);
            })
                .catch(function (err) {
                callback(err);
            });
        }
        else if (!connection) {
            callback(new Error("No connection on list with id: " + id));
        }
        else {
            callback(optionsError);
        }
    }
    verifySendMessageOptions(options) {
        let error;
        if (!options.chat_id && !options.text) {
            error = new Error("Parameters chat_id and text are required in Telegram API.");
        }
        else if (!options.chat_id) {
            error = new Error("Parameter chat_id is required in Telegram API.");
        }
        else if (!options.text) {
            error = new Error("Parameter text is required in Telegram API.");
        }
        else {
            error = null;
        }
        return error;
    }
}
exports.TelegramConnector = TelegramConnector;
class TelegramConnection extends bfmb_base_connector_1.Connection {
    constructor(options) {
        super(options);
        let tOptions = this.getTelegramBotOptions(options);
        this.token = options.token;
        this.lastUpdateId = 0;
        this.bot = new TelegramBot(this.token, tOptions);
    }
    getTelegramBotOptions(options) {
        return {
            polling: options.polling
        };
    }
    getBot() {
        return this.bot;
    }
    getOffsetUpdateId() {
        return this.lastUpdateId;
    }
    setOffsetUpdateId(lastUpdateId) {
        this.lastUpdateId = lastUpdateId;
    }
}
exports.TelegramConnection = TelegramConnection;
exports.connector = new TelegramConnector();
