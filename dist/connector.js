"use strict";
/**
 * This file has both classes required for this module.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bfmb_base_connector_1 = require("bfmb-base-connector");
const TelegramBot = require("node-telegram-bot-api");
/**
 * Class TelegramConnector. Extends Connector class from bfmb-base-connector module.
 */
class TelegramConnector extends bfmb_base_connector_1.Connector {
    /**
     * The constructor only calls to parent class passing the network identification.
     */
    constructor() {
        super("Telegram");
    }
    /**
     * This method adds a TelegramConnection object to the connector.
     * @param options A not type-defined object. Requires the attribute **token** to be valid.
     * This value is needed to contact with Telegram servers as a bot. The token is given by BotFather account.
     * @param callback Callback function which it gives the results or the failure of the task.
     */
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
    /**
     * This method is not required for this connector.
     * @param id The uuid of the connection to do the call.
     * @param options A not type-defined object. Actually it's empty.
     * @param callback Function which return response or error from the connection.
     */
    getMe(id, options = {}, callback) {
        callback(new Error("Not required."));
    }
    /**
     * This method is the universal method for calling get methods of Tado client module.
     * @param id The uuid of the connection to do the call.
     * @param options A not type-defined object. Contains the parameters that the api endpoint require.
     * @param callback Function which return response or error from the connection.
     */
    receiveMessage(id, options = {}, callback) {
        const self = this;
        const connection = self.getConnection(id);
        if (connection) {
            options = self.getUpdateOffset(connection, options);
            connection.getBot().getUpdates(options).then(function (response) {
                connection.setOffsetUpdateId(self.parseUpdateOffset(response));
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
        if (response.length > 0) {
            updateId = response[response.length - 1].update_id;
        }
        else {
            updateId = 0;
        }
        return updateId;
    }
    sendMessage(id, options = {}, callback) {
        const self = this;
        const connection = self.getConnection(id);
        const optionsError = self.verifySendMessageOptions(options);
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
