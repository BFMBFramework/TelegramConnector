
export class TelegramUser {
	id : number;
	is_bot : boolean;
	first_name : string;
	last_name : string;
	username : string;
	language_code : string;

	constructor(objData : any) {
		this.id = objData.id;
		this.is_bot = objData.is_bot;
		this.first_name = objData.first_name;
		this.last_name = objData.last_name;
		this.username = objData.username;
		this.language_code = objData.language_code;
	}
}