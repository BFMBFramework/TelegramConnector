import {TelegramConnection} from "./lib/connection";
import {TelegramUser} from "./lib/user";

export class TelegramConnector {
	connections : TelegramConnection[];

	constructor() {}

	addConnection(token : string, callback : Function) {
		let connection : TelegramConnection = new TelegramConnection(token);

		connection.getMe(function (err : Error, user : TelegramUser) {
			if (err) return callback(err);
			this.connections.push(connection);
			callback(null, connection.id);
		});
	}

	removeConnection(id : string, callback : Function) {
		let index : number = this.connections.findIndex((i : TelegramConnection) => { return i.id === id });
		if (index > -1) {
			this.connections.splice(index, 1);
			callback(null);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	receiveMessage(id : string, options : any = {}, callback : Function) {
		let index : number = this.connections.findIndex((i : TelegramConnection) => { return i.id === id });
		if (index > -1) {
			this.connections[index].getUpdates(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	sendMessage(id : string, options : any = {}, callback : Function) {
		let index : number = this.connections.findIndex((i : TelegramConnection) => { return i.id === id });
		if (index > -1) {
			this.connections[index].sendMessage(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}
}