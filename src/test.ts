import {TelegramConnection} from "./lib/connection";
import {TelegramUser} from "./lib/user";

let testConnection = new TelegramConnection();

testConnection.requestBotData(function(err : Error, user : TelegramUser) {
	if (err) {
		console.log(err);
	}
	console.log(user);
});
