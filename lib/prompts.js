/* @flow */

import inquirer from "inquirer";
import Future from "fluture";
import { prop } from "ramda";

export const prompt = Future.encaseP(inquirer.prompt);

export const singlePrompt = (promptDetails: {
	type:
		| "input"
		| "confirm"
		| "list"
		| "rawlist"
		| "expand"
		| "checkbox"
		| "password"
		| "editor",
	message: string | Function,
	default: string | number | boolean | Array<any> | Function,
	choices: Array<any> | Function,
	validate: Function,
	filter: Function,
	transformer: Function,
	when: Function | boolean,
	pageSize: number,
	prefix: string,
	suffix: string,
}) => prompt({ ...promptDetails, name: "name" }).map(prop("name"));
