/* @flow */

import Future from "fluture";
import childProcess from "child_process";
import stringArgv from "string-argv";

type childProcessExecOpts = {
	cwd?: string,
	env?: Object,
	encoding?: string,
	shell?: string,
	timeout?: number,
	maxBuffer?: number,
	killSignal?: string,
	uid?: number,
	gid?: number,
};

export const fromCommand = (command: string, options: childProcessExecOpts) =>
	Future(
		(reject, resolve) =>
			childProcess.exec(
				command,
				options,
				(error, stdout, stderr) =>
					error
						? reject(new Error(`${error.message} -- ${stderr.toString()}`))
						: resolve(stdout)
			) && undefined
	);

type childProcessSpawnOpts = {
	cwd?: string,
	env?: Object,
	argv0?: string,
	stdio?: string | Array<any>,
	detached?: boolean,
	uid?: number,
	gid?: number,
	shell?: boolean | string,
};

export const executeCommandInheritStdout = (
	command: string,
	options: childProcessSpawnOpts = {}
) =>
	Future((reject, resolve) => {
		let args = [];
		const regexResults = /^(\S+)\s([\s\S]*)/m.exec(command);

		if (regexResults) {
			command = regexResults[1];
			args = regexResults.length >= 3 ? stringArgv(regexResults[2]) : [];
		}

		const commandProcess = childProcess.spawn(command, args, {
			stdio: options.stdio || "inherit",
			...options,
		});

		let exited = false;
		commandProcess.on("error", error => {
			if (!exited) {
				exited = true;
				reject(error);
			}
		});
		commandProcess.on("exit", code => {
			if (!exited) {
				exited = true;
				if (code === 0) resolve();
				else {
					reject(new Error(`Error. Process exited with status code: ${code}`));
				}
			}
		});
	});
