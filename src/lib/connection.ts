import * as request from "request";

import {TelegramUser} from "./user";

export const TELEGRAM_URL = "https://api.telegram.org/";

export class TelegramConnection {
	token : string;
	user : TelegramUser; 

	constructor (token: string) {
		this.token = token;
	}

	requestBotData (callback : Function) {
		request(TELEGRAM_URL + "bot" + this.token + "/getMe", (err : any, r : any, body : string) => {
			const response = JSON.parse(body).result;
			if (err) {
				callback(err);
				return;
			}
			if (!response) {
				callback(new Error("No response."));
				return;
			}
			this.user = new TelegramUser(response);
			callback(null, this.user);
		});
	}
}