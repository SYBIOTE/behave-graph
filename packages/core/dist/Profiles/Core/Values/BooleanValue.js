export const BooleanValue = {
    name: 'boolean',
    creator: () => false,
    deserialize: (value) => typeof value === 'string' ? value.toLowerCase() === 'true' : value,
    serialize: (value) => value,
    lerp: (start, end, t) => (t < 0.5 ? start : end),
    equals: (a, b) => a === b,
    clone: (value) => value
};
//# sourceMappingURL=BooleanValue.js.map