/**
 * This file has both classes required for this module.
 */

import {Connector, Connection} from "bfmb-base-connector";
import * as TelegramBot from "node-telegram-bot-api";

/**
 * Class TelegramConnector. Extends Connector class from bfmb-base-connector module.
 */
export class TelegramConnector extends Connector {

	/**
	 * The constructor only calls to parent class passing the network identification.
	 */
	constructor() {
		super("Telegram");
	}

	/**
	 * This method adds a TelegramConnection object to the connector.
	 * @param options A not type-defined object. Requires the attribute **token** to be valid. 
	 * This value is needed to contact with Telegram servers as a bot. The token is given by BotFather account.
	 * @param callback Callback function which it gives the results or the failure of the task.
	 */
	addConnection(options: any, callback: Function): void {
		const self = this;
		const connection: TelegramConnection = new TelegramConnection(options);

		connection.getBot().getMe().then(function(user: TelegramBot.User) {
			self.connections.push(connection);
			callback(null, connection.getId());
		})
		.catch(function(err: Error) {
			callback(err);
		});
	}

	/**
	 * This method is not required for this connector.
	 * @param id The uuid of the connection to do the call.
	 * @param options A not type-defined object. Actually it's empty.
	 * @param callback Function which return response or error from the connection.
	 */
	getMe(id: string, options: any = {}, callback: Function): void {
		callback(new Error("Not required."));
	}

	/**
	 * This method is the universal method for calling get methods of Tado client module.
	 * @param id The uuid of the connection to do the call.
	 * @param options A not type-defined object. Contains the parameters that the api endpoint require.
	 * @param callback Function which return response or error from the connection.
	 */
	receiveMessage(id: string, options: any = {}, callback: Function): void {
		const self = this;
		const connection: TelegramConnection = <TelegramConnection> self.getConnection(id);
		if (connection) {
			options = self.getUpdateOffset(connection, options)
			connection.getBot().getUpdates(options).then(function(response: TelegramBot.Update[]) {
				connection.setOffsetUpdateId(self.parseUpdateOffset(response));
				callback(null, response);
			})
			.catch(function(err: Error) {
				callback(err);
			});
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	private getUpdateOffset(connection: TelegramConnection, options: any): any {
		if (!options.offset) options.offset = connection.getOffsetUpdateId() + 1;
		return options;
	}

	private parseUpdateOffset(response: TelegramBot.Update[]): number {
		let updateId: number;
		if (response.length > 0) {
			updateId = response[response.length - 1].update_id;
		} else {
			updateId = 0;
		}
		return updateId;
	}

	sendMessage(id: string, options: any = {}, callback: Function): void {
		const self = this;
		const connection: TelegramConnection = <TelegramConnection> self.getConnection(id);
		const optionsError: Error = self.verifySendMessageOptions(options);
		if (connection && !optionsError) {
			connection.getBot().sendMessage(options.chat_id, options.text, options.params)
			.then(function(message: TelegramBot.Message) {
				callback(null, message);
			})
			.catch(function(err: Error) {
				callback(err);
			});
		} else if (!connection) {
			callback(new Error("No connection on list with id: " + id));
		} else {
			callback(optionsError);
		}
	}

	private verifySendMessageOptions(options: any): Error {
		let error: Error;
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
	private token: string;
	private lastUpdateId: number;
	private bot: TelegramBot;

	constructor(options: any) {
		super(options);
		let tOptions = this.getTelegramBotOptions(options);
		this.token = options.token;
		this.lastUpdateId = 0;
		this.bot = new TelegramBot(this.token, tOptions);
	}

	private getTelegramBotOptions(options: any): any {
		return {
			polling: options.polling
		}
	}

	getBot(): TelegramBot {
		return this.bot;
	}

	getOffsetUpdateId(): number {
		return this.lastUpdateId;
	}

	setOffsetUpdateId(lastUpdateId: number) {
		this.lastUpdateId = lastUpdateId;
	}
}

export const connector = new TelegramConnector();