/* @flow */

import Future from "fluture";

import { readFile } from "./fs.js";

export const jsonParse = Future.encase(JSON.parse);

export const loadJson = (filePath: string) =>
	readFile(filePath, "utf8").chain(jsonParse);
