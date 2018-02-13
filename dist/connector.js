"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./lib/connection");
class TelegramConnector {
    constructor() { }
    addConnection(token, callback) {
        let connection = new connection_1.TelegramConnection(token);
        connection.getMe(function (err, user) {
            if (err)
                return callback(err);
            this.connections.push(connection);
            callback(null, connection.id);
        });
    }
    removeConnection(id, callback) {
        let index = this.connections.findIndex((i) => { return i.id === id; });
        if (index > -1) {
            this.connections.splice(index, 1);
            callback(null);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
    receiveMessage(id, options = {}, callback) {
        let index = this.connections.findIndex((i) => { return i.id === id; });
        if (index > -1) {
            this.connections[index].getUpdates(options, callback);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
    sendMessage(id, options = {}, callback) {
        let index = this.connections.findIndex((i) => { return i.id === id; });
        if (index > -1) {
            this.connections[index].sendMessage(options, callback);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
}
exports.TelegramConnector = TelegramConnector;
