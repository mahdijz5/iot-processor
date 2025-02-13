import { Brand } from './brand';

export * from './brand';

export type NonEmptyString = NonEmptyString.Type;
export namespace NonEmptyString {
  export type Type = Brand<string, 'NonEmptyString'>;
  export const is = (value: string): value is NonEmptyString =>
    value.trim().length > 0;
  export const mk = (value: string): NonEmptyString | null =>
    is(value) ? value : null;
  export const mkUnsafe = (value: string) => {
    if (!is(value)) throw new Error('Invalid NonEmptyString');
    return value;
  };
}

export type ObjectId = ObjectId.Type;
export namespace ObjectId {
  export type Type = Brand<string, 'ObjectId'>;
  const regex = /^[a-f\d]{24}$/i;
  export const is = (value: string): value is ObjectId => regex.test(value);
  export const mk = (value: string): ObjectId | null =>
    is(value) ? value : null;
  export const mkUnsafe = (value: string): ObjectId => {
    if (!is(value)) throw new Error('Invalid ObjectId');
    return value;
  };
}

export type NonEmptyStringArray = NonEmptyStringArray.Type;
export namespace NonEmptyStringArray {
  export type Type = Brand<string[], 'NonEmptyStringArray'>;
  export const is = (value: string[]): value is NonEmptyStringArray =>
    value.every((item) => item.trim().length > 0);
  export const mk = (value: string[]): NonEmptyStringArray | null =>
    is(value) ? value : null;
  export const mkUnsafe = (value: string[]) => {
    if (!is(value)) throw new Error('Invalid NonEmptyStringArray');
    return value;
  };
}

export type PositiveNumber = PositiveNumber.Type;
export namespace PositiveNumber {
  export type Type = Brand<number, 'PositiveNumber'>;
  export const is = (value: number): value is PositiveNumber =>
    typeof value === 'number' && Number.isFinite(value) && value > 0;
  export const mk = (value: number): PositiveNumber | null =>
    is(value) ? value : null;
  export const mkUnsafe = (value: number) => {
    if (!is(value)) throw new Error('Invalid PositiveNumber');
    return value;
  };
}

export type ValidNumber = ValidNumber.Type;
export namespace ValidNumber {
  export type Type = Brand<number, 'ValidNumber'>;

  export const is = (value: number): value is ValidNumber =>
    typeof value === 'number' && Number.isFinite(value) && !isNaN(value);
  export const mk = (value: number): ValidNumber | null =>
    is(value) ? value : null;
  export const mkUnsafe = (value: number) => {
    if (!is(value)) throw new Error('Invalid ValidNumber');
    return value;
  };
}

export type NonNegativeNumber = NonNegativeNumber.Type;
export namespace NonNegativeNumber {
  export type Type = Brand<number, 'NonNegativeNumber'>;

  export const is = (value: number): value is NonNegativeNumber =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0;
  export const mk = (value: number): NonNegativeNumber | null =>
    is(value) ? value : null;
  export const mkUnsafe = (value: number) => {
    if (!is(value)) throw new Error('Invalid NonNegativeNumber');
    return value;
  };
}

export type Timestamp = Timestamp.Type;
export namespace Timestamp {
  export type Type = Brand<number, 'Timestamp'>;
  export const is = (value: number): value is Timestamp =>
    Number.isInteger(value) && value.toString().length === 13;
  export const mk = (value: number): Timestamp | null =>
    is(value) ? (value as Timestamp) : null;
  export const mkUnsafe = (value: number): Timestamp => {
    if (!is(value)) throw new Error('Invalid Timestamp');
    return value as Timestamp;
  };
}
