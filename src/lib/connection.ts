import * as request from "request";
import * as uuidv1 from "uuid/v1";

import {TelegramUser} from "./user";

export const TELEGRAM_URL = "https://api.telegram.org/";

export class TelegramConnection {
	id : string;
	token : string;
	last_update_id : number;
	user : TelegramUser; 

	constructor (token : string) {
		this.token = token;
		this.last_update_id = 0;
		this.id = uuidv1();
	}

	getMe (callback : Function) {
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

	getUpdates (options : any = {}, callback : Function) {
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

	sendMessage (options : any = {}, callback : Function) {
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