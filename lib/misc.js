/* @flow */

import Future, { type Fluture as FutureMonad } from "fluture";
import { pipe, toPairs, zip, fromPairs } from "ramda";

const map = fn => x => x.map(fn);

const unZip = listOfPairs =>
	listOfPairs.reduce(
		(unzipped, pair) => [
			unzipped[0].concat(pair[0]),
			unzipped[1].concat(pair[1]),
		],
		[[], []]
	);

type asFutureValuesFn = ({
	[string]: FutureMonad<mixed, mixed>,
}) => FutureMonad<mixed, { [string]: mixed }>;
export const asFutureValues: asFutureValuesFn = pipe(
	toPairs,
	unZip,
	([keys, values]) =>
		Future.parallel(Infinity, values).map(values => zip(keys, values)),
	map(fromPairs)
);
