import { quatSlerp, Vec4, vec4Equals, vec4Parse } from './Internal/Vec4.js';
export const QuatValue = {
    name: 'quat',
    creator: () => new Vec4(),
    deserialize: (value) => typeof value === 'string'
        ? vec4Parse(value)
        : new Vec4(value[0], value[1], value[2], value[3]),
    serialize: (value) => [value.x, value.y, value.z, value.w],
    lerp: (start, end, t) => quatSlerp(start, end, t),
    equals: (a, b) => vec4Equals(a, b),
    clone: (value) => value.clone()
};
//# sourceMappingURL=QuatValue.js.map