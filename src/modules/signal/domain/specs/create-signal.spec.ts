import { CreateSignal } from '../create-signal';

jest.mock('../xray', () => ({
  Xray: {
    mk: jest.fn((data) => data),
  },
}));

describe('CreateSignal Domain', () => {
  const validDeviceId = '67ad08ba721b8d0aae790165';
  const validTime = Date.now();
  const validData = [
    { time: validTime, speed: 10, x: 5, y: 7 },
    { time: validTime, speed: 20, x: 8, y: 3 },
  ];

  it('should create a valid CreateSignal object', () => {
    const input = {
      deviceId: 'device_123',
      time: Date.now(),
      data: [
        { time: validTime, speed: 10, x: 5, y: 7 },
        { time: validTime, speed: 20, x: 8, y: 3 },
      ],
    };

    const createSignal = CreateSignal.mk(input);

    expect(createSignal.deviceId).toBe(input.deviceId);
    expect(createSignal.time).toBe(input.time);
    expect(createSignal.dataLength).toBe(input.data.length);
    expect(createSignal.dataVolume).toBe(8);
    expect(createSignal.data).toHaveLength(input.data.length);
  });

  it('should throw an error for invalid deviceId', () => {
    expect(() =>
      CreateSignal.mk({
        deviceId: '',
        time: validTime,
        data: validData,
      }),
    ).toThrow('Invalid deviceId');
  });

  it('should throw an error for invalid timestamp', () => {
    expect(() =>
      CreateSignal.mk({
        deviceId: validDeviceId,
        time: -1,
        data: validData,
      }),
    ).toThrow('Invalid timestamp');
  });

  it('should handle empty data array', () => {
    const input = {
      deviceId: validDeviceId,
      time: validTime,
      data: [],
    };

    const createSignal = CreateSignal.mk(input);

    expect(createSignal.dataLength).toBe(0);
    expect(createSignal.dataVolume).toBe(0);
    expect(createSignal.data).toEqual([]);
  });
});
