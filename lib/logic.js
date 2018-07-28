/* @flow */

import Future, { type Fluture as FutureMonad } from "fluture";

const reduce = (fn, acc, array) => array.reduce(fn, acc);

// type FutureMonad = typeof Future;
type Condition<A, B> = [
	(input: A) => FutureMonad<mixed, boolean>,
	(input: A) => B,
];

export const condF = <A: *, B: *>(pairs: Array<Condition<A, B>>) => (
	input: A
): FutureMonad<mixed, B> =>
	reduce(
		(resultFuture, pair, index) =>
			resultFuture.chainRej(() =>
				pair[0](input).chain(
					boolean => (boolean ? Future.of(index) : Future.reject())
				)
			),
		Future.reject(),
		pairs
	)
		.mapRej(() => new Error("No matching conditions found"))
		.chain(index => Future.of(pairs[index][1](input)));

export const trueF = () => Future.of(true);
export const falseF = () => Future.of(false);
