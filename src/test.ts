import {TelegramConnection} from "./lib/connection";
import {TelegramUser} from "./lib/user";

let testConnection = new TelegramConnection(process.env.TELEGRAM_TOKEN);

testConnection.getMe(function (err : Error, user : TelegramUser) {
	if (err) {
		console.log(err);
	}
	console.log(user);
});

testConnection.getUpdates({ offset: 267885263, timeout: 15 }, function (err : Error, response : any) {
	if (err) {
		console.log(err);
	}
	console.log(response);
	for (let update of response) {
		if(update.message.text === "Nice meme") {
			testConnection.sendMessage({ chat_id: update.message.chat.id, text: "Thanks hue hue" }, function (err : Error, response : any) {
				if (err) {
					console.log(err);
				}
				console.log(response);
			});
		}
	}
});