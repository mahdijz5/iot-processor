import { ObjectId } from 'src/common/types';
import { UpdateSignal } from '../update-signal';
import { Xray } from '../xray';

jest.mock('../xray', () => ({
  Xray: {
    mk: jest.fn((data) => data),
  },
}));

describe('UpdateSignal Domain', () => {
  const validId = ObjectId.mkUnsafe('67ad08ba721b8d0aae790165');
  const validDeviceId = '67ad08ba721b8d0aae790165';
  const validTime = Date.now();
  const validData = [
    { time: validTime, speed: 10, x: 5, y: 7 },
    { time: validTime, speed: 20, x: 8, y: 3 },
  ];

  it('should create a valid UpdateSignal object', () => {
    const signal = UpdateSignal.mk({
      id: validId,
      deviceId: validDeviceId,
      time: validTime,
      data: validData,
    });

    expect(signal.id).toBe(validId);
    expect(signal.deviceId).toBe(validDeviceId);
    expect(signal.time).toBe(validTime);
    expect(signal.dataLength).toBe(validData.length);
    expect(signal.dataVolume).toBe(8);
    expect(signal.data).toEqual(validData);
    expect(Xray.mk).toHaveBeenCalledTimes(validData.length);
  });

  it('should create an UpdateSignal object with optional fields omitted', () => {
    const signal = UpdateSignal.mk({ id: validId });
    expect(signal.id).toBe(validId);
    expect(signal.deviceId).toBeUndefined();
    expect(signal.time).toBeUndefined();
    expect(signal.data).toBeUndefined();
    expect(signal.dataLength).toBeUndefined();
    expect(signal.dataVolume).toBeUndefined();
  });

  it('should throw an error for an invalid id', () => {
    expect(() => UpdateSignal.mk({ id: 'invalid_id' })).toThrow();
  });

  it('should throw an error for an invalid deviceId', () => {
    expect(() => UpdateSignal.mk({ id: validId, deviceId: '' })).toThrow(
      'Invalid deviceId',
    );
  });

  it('should throw an error for an invalid timestamp', () => {
    expect(() => UpdateSignal.mk({ id: validId, time: -1 })).toThrow(
      'Invalid timestamp',
    );
  });
});
