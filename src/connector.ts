import {Connector} from "bfmb-comcenter";

import {TelegramConnection} from "./lib/connection";
import {TelegramUser} from "./lib/user";

export default class TelegramConnector extends Connector {

	constructor() {
		super("Telegram");
	}

	addConnection(options : any, callback : Function) {
		const self = this;
		let connection : TelegramConnection = new TelegramConnection(options);

		connection.getMe(function (err : Error, user : TelegramUser) {
			if (err) return callback(err);
			self.connections.push(connection);
			callback(null, connection.getId());
		});
	}

	receiveMessage(id : string, options : any = {}, callback : Function) {
		const connection : TelegramConnection = <TelegramConnection> this.getConnection(id);
		if (connection) {
			connection.getUpdates(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	sendMessage(id : string, options : any = {}, callback : Function) {
		const connection : TelegramConnection = <TelegramConnection> this.getConnection(id);
		if (connection) {
			connection.sendMessage(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}
}