/* @flow */

import { cond, isNil, T } from "ramda";
import fs from "fs";
import Future, { Fluture as MonadFuture } from "fluture";

export const readFile = Future.encaseN2(fs.readFile);

type fileExistsFn = (path: string) => MonadFuture<Error, boolean>;
export const fileExists: fileExistsFn = path =>
	Future((reject, resolve) => {
		fs.stat(path, err =>
			cond([
				[isNil, () => resolve(true)],
				[err => !!err && err.code === "ENOENT", () => resolve(false)],
				[T, err => reject(err || new Error())],
			])(err)
		);
	});
