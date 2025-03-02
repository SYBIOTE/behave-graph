import { parseSafeFloat } from '../../../parseFloats.js';
export const FloatValue = {
    name: 'float',
    creator: () => 0,
    deserialize: (value) => typeof value === 'string' ? parseSafeFloat(value, 0) : value,
    serialize: (value) => value,
    lerp: (start, end, t) => start * (1 - t) + end * t,
    equals: (a, b) => a === b,
    clone: (value) => value
};
//# sourceMappingURL=FloatValue.js.map