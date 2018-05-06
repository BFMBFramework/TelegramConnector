import {Connector, Connection} from "bfmb-base-connector";
import * as request from "request";

import {TelegramUser} from "./lib/user";

export const TELEGRAM_URL = "https://api.telegram.org/";

export class TelegramConnector extends Connector {

	constructor() {
		super("Telegram");
	}

	addConnection(options : any, callback : Function) : void {
		const self = this;
		let connection : TelegramConnection = new TelegramConnection(options);

		connection.getMe(function (err : Error, user : TelegramUser) {
			if (err) return callback(err);
			self.connections.push(connection);
			callback(null, connection.getId());
		});
	}

	receiveMessage(id : string, options : any = {}, callback : Function) : void{
		const connection : TelegramConnection = <TelegramConnection> this.getConnection(id);
		if (connection) {
			connection.getUpdates(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	sendMessage(id : string, options : any = {}, callback : Function) : void{
		const connection : TelegramConnection = <TelegramConnection> this.getConnection(id);
		if (connection) {
			connection.sendMessage(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}
}

export class TelegramConnection extends Connection {
	private token : string;
	private last_update_id : number;
	private user : TelegramUser; 

	constructor (options : any) {
		super(options);
		this.token = options.token;
		this.last_update_id = 0;
	}

	getMe (callback : Function) : void{
		if (this.user) {
			return callback(null, this.user);
		}

		request.get({url: TELEGRAM_URL + "bot" + this.token + "/getMe"}, (err : any, r : any, body : string) => {
			const response = JSON.parse(body).result;
			
			if (err) return callback(err);
			if (!response) return callback(new Error("No response received."));
			
			this.user = new TelegramUser(response);
			callback(null, this.user);
		});
	}

	getUpdates (options : any = {}, callback : Function) : void {
		if (!options.offset) options.offset = this.last_update_id + 1;
		if (!options.timeout) options.timeout = 15;

		request.get({url: TELEGRAM_URL + "bot" + this.token + "/getUpdates", formData: options}, (err : any, r : any, body : string) => {
			const response : Array<any> = JSON.parse(body).result;
						
			if (err) return callback(err);
			if (!response) return callback(new Error("No response received."));

			this.last_update_id = response[response.length - 1].update_id;
			callback(null, response);
		});
	}

	sendMessage (options : any = {}, callback : Function) : void {
		if(!options.chat_id) return callback(new Error("Parameter chat_id is required in Telegram API."));
		if(!options.text) return callback(new Error("Parameter text is required in Telegram API."));

		request.post({url: TELEGRAM_URL + "bot" + this.token + "/sendMessage", formData: options}, (err : any, r : any, body : string) => {
			const response = JSON.parse(body).result;
			
			if (err) return callback(err);
			if (!response) return callback(new Error("No response received."));
			
			callback(null, response);
		});
	}
}

export const connector = new TelegramConnector();