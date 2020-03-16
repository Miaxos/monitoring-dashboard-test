import { createOpaqueAPI } from '@iadvize-oss/opaque-type';
import * as Either from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';

/**
 * We are using OpaqueTypes here, to avoid developpers to construct the
 * type without using API functions.
 *
 * We are constructing a custom API for the Date type, because the original
 * Date type is flawed:
 *
 * ```
 * const date_valid = new Date();
 * const date_invalid = new Date('blblblbl');
 * ```
 *
 * These two dates will be valid, they will run inside the JS interpreter
 *
 * ```
 * date_valid.toISOString(); // Ok.
 * date_invalid.toISOString(); // Throw an error.
 * ```
 *
 */

type $DateEither = {
  date: Either.Either<Error, Date>;
};

const DateEither = createOpaqueAPI<'DATE_EITHER', $DateEither>('DATE_EITHER');

export type DateEither = ReturnType<typeof DateEither.toOpaque>;

/**
 * Function to create a DateEither from a string
 */
export function createFromString(dateString: string): DateEither {
  const dateUnsafe = new Date(dateString);

  if (dateUnsafe.toString() === 'Invalid Date') {
    return DateEither.toOpaque({
      date: Either.left(new Error('Invalid Date')),
    });
  }

  return DateEither.toOpaque({
    date: Either.right(dateUnsafe),
  });
}

/**
 * Function to create a DateEither from a date
 */
export function createFromDate(dateUnsafe: Date): DateEither {
  if (dateUnsafe.toString() === 'Invalid Date') {
    return DateEither.toOpaque({
      date: Either.left(new Error('Invalid Date')),
    });
  }

  return DateEither.toOpaque({
    date: Either.right(new Date(dateUnsafe)),
  });
}

/**
 * Get the date from a DateEither Element
 */
export function date(dateEither: DateEither): Either.Either<Error, Date> {
  return pipe(dateEither, DateEither.fromOpaque, elt => elt.date);
}

/**
 * Get the formatted date from a DateEither Element.
 */
export function time(dateEither: DateEither): Either.Either<Error, string> {
  return pipe(
    dateEither,
    DateEither.fromOpaque,
    elt => elt.date,
    Either.map(elt => elt.toLocaleTimeString()),
  );
}
