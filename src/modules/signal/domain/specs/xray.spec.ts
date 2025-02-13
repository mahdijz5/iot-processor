import { z } from 'zod';
import { Xray } from '../xray';

describe('Xray Module', () => {
  test('should create a valid Xray object', () => {
    const validData = { time: 5, speed: 0, x: 10.5, y: -3.2 };

    expect(() => Xray.mk(validData)).not.toThrow();

    const result = Xray.mk(validData);
    expect(result).toEqual(validData);
  });

  test('should throw error if time is not positive', () => {
    const invalidData = { time: 0, speed: 5, x: 10, y: 20 };

    expect(() => Xray.mk(invalidData)).toThrow(z.ZodError);
  });

  test('should throw error if speed is negative', () => {
    const invalidData = { time: 5, speed: -1, x: 10, y: 20 };

    expect(() => Xray.mk(invalidData)).toThrow(z.ZodError);
  });

  test('should throw error if x is not a valid number', () => {
    const invalidData = { time: 5, speed: 10, x: NaN, y: 20 };

    expect(() => Xray.mk(invalidData)).toThrow(z.ZodError);
  });

  test('should throw error if y is not a valid number', () => {
    const invalidData = { time: 5, speed: 10, x: 10, y: Infinity };

    expect(() => Xray.mk(invalidData)).toThrow(z.ZodError);
  });

  test('should throw error for missing fields', () => {
    const invalidData = { time: 5, speed: 10, x: 10 };

    expect(() => Xray.mk(invalidData as any)).toThrow(z.ZodError);
  });
});
