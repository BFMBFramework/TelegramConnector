"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bfmb_base_connector_1 = require("bfmb-base-connector");
const connection_1 = require("./lib/connection");
class TelegramConnector extends bfmb_base_connector_1.Connector {
    constructor() {
        super("Telegram");
    }
    addConnection(options, callback) {
        const self = this;
        let connection = new connection_1.TelegramConnection(options);
        connection.getMe(function (err, user) {
            if (err)
                return callback(err);
            self.connections.push(connection);
            callback(null, connection.getId());
        });
    }
    receiveMessage(id, options = {}, callback) {
        const connection = this.getConnection(id);
        if (connection) {
            connection.getUpdates(options, callback);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
    sendMessage(id, options = {}, callback) {
        const connection = this.getConnection(id);
        if (connection) {
            connection.sendMessage(options, callback);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
}
exports.default = TelegramConnector;
