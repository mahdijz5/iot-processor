import { ObjectId } from 'src/common/types';
import { Signal } from '../signal';
import { Xray } from '../xray';

jest.mock('../xray', () => ({
  Xray: {
    mk: jest.fn((data) => data),
  },
}));

describe('Signal Domain', () => {
  const validId = ObjectId.mkUnsafe('67ad08b007b0b8f727be2bec');
  const validDeviceId = '67ad08ba721b8d0aae790165';
  const validTime = Date.now();
  const validData = [
    { time: 10, speed: 10, x: 5, y: 7 },
    { time: 100, speed: 20, x: 8, y: 3 },
  ];

  it('should create a valid Signal object', () => {
    const signal = Signal.mk({
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

  it('should throw an error for an invalid id', () => {
    expect(() =>
      Signal.mk({
        id: 'invalid_id',
        deviceId: validDeviceId,
        time: validTime,
        data: validData,
      }),
    ).toThrow('Invalid time');
  });

  it('should throw an error for an empty deviceId', () => {
    expect(() =>
      Signal.mk({
        id: validId,
        deviceId: '',
        time: validTime,
        data: validData,
      }),
    ).toThrow('Invalid deviceId');
  });

  it('should throw an error for an invalid timestamp', () => {
    expect(() =>
      Signal.mk({
        id: validId,
        deviceId: validDeviceId,
        time: -1,
        data: validData,
      }),
    ).toThrow('Invalid timestamp');
  });

  it('should handle empty data array', () => {
    const signal = Signal.mk({
      id: validId,
      deviceId: validDeviceId,
      time: validTime,
      data: [],
    });

    expect(signal.dataLength).toBe(0);
    expect(signal.dataVolume).toBe(0);
    expect(signal.data).toEqual([]);
  });
});
