import {Connector, Connection} from "bfmb-base-connector";
import * as TelegramBot from "node-telegram-bot-api";

export class TelegramConnector extends Connector {

	constructor() {
		super("Telegram");
	}

	addConnection(options : any, callback : Function) : void {
		const self = this;
		const connection : TelegramConnection = new TelegramConnection(options);

		connection.getBot().getMe().then(function(user : TelegramBot.User) {
			self.connections.push(connection);
			callback(null, connection.getId());
		})
		.catch(function(err : Error) {
			callback(err);
		});
	}

	receiveMessage(id : string, options : any = {}, callback : Function) : void{
		const self = this;
		const connection : TelegramConnection = <TelegramConnection> self.getConnection(id);
		if (connection) {
			options = self.getUpdateOffset(connection, options)
			connection.getBot().getUpdates(options).then(function(response : TelegramBot.Update[]) {
				connection.setOffsetUpdateId(self.parseUpdateOffset(response));
				callback(null, response);
			})
			.catch(function(err : Error) {
				callback(err);
			});
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	private getUpdateOffset(connection : TelegramConnection, options : any) : any {
		if (!options.offset) options.offset = connection.getOffsetUpdateId() + 1;
		return options;
	}

	private parseUpdateOffset(response : TelegramBot.Update[]) : number {
		let updateId : number;
		if (response.length > 0) {
			updateId = response[response.length - 1].update_id;
		} else {
			updateId = 0;
		}
		return updateId;
	}

	sendMessage(id : string, options : any = {}, callback : Function) : void {
		const self = this;
		const connection : TelegramConnection = <TelegramConnection> self.getConnection(id);
		const optionsError : Error = self.verifySendMessageOptions(options);
		if (connection && !optionsError) {
			connection.getBot().sendMessage(options.chat_id, options.text, options.params)
			.then(function(message : TelegramBot.Message) {
				callback(null, message);
			})
			.catch(function(err : Error) {
				callback(err);
			});
		} else if (!connection) {
			callback(new Error("No connection on list with id: " + id));
		} else {
			callback(optionsError);
		}
	}

	private verifySendMessageOptions(options : any) : Error {
		let error : Error;
		if(!options.chat_id && !options.text) {
			error = new Error("Parameters chat_id and text are required in Telegram API.");
		} else if(!options.chat_id) {
			error = new Error("Parameter chat_id is required in Telegram API.");
		} else if(!options.text) {
			error = new Error("Parameter text is required in Telegram API.");
		} else {
			error = null;
		}
		return error;
	}
}

export class TelegramConnection extends Connection {
	private token : string;
	private lastUpdateId : number;
	private bot : TelegramBot;

	constructor (options : any) {
		super(options);
		let tOptions = this.getTelegramBotOptions(options);
		this.token = options.token;
		this.lastUpdateId = 0;
		this.bot = new TelegramBot(this.token, tOptions);
	}

	private getTelegramBotOptions(options : any) : any {
		return {
			polling: options.polling
		}
	}

	getBot() : TelegramBot {
		return this.bot;
	}

	getOffsetUpdateId() : number {
		return this.lastUpdateId;
	}

	setOffsetUpdateId(lastUpdateId : number) {
		this.lastUpdateId = lastUpdateId;
	}
}

export const connector = new TelegramConnector();