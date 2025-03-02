import { clamp, EPSILON, equalsTolerance, parseSafeFloats, toSafeString } from '@behave-graph/core';
import { mat4ToMat3, quatToMat3 } from './Mat3.js';
export class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    clone(result = new Vec3()) {
        return result.set(this.x, this.y, this.z);
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
}
export function vec3Equals(a, b, tolerance = EPSILON) {
    return (equalsTolerance(a.x, b.x, tolerance) &&
        equalsTolerance(a.y, b.y, tolerance) &&
        equalsTolerance(a.z, b.z, tolerance));
}
export function vec3Add(a, b, result = new Vec3()) {
    return result.set(a.x + b.x, a.y + b.y, a.z + b.z);
}
export function vec3Subtract(a, b, result = new Vec3()) {
    return result.set(a.x - b.x, a.y - b.y, a.z - b.z);
}
export function vec3MultiplyByScalar(a, b, result = new Vec3()) {
    return result.set(a.x * b, a.y * b, a.z * b);
}
export function vec3Negate(a, result = new Vec3()) {
    return result.set(-a.x, -a.y, -a.z);
}
export function vec3Length(a) {
    return Math.sqrt(vec3Dot(a, a));
}
export function vec3Normalize(a, result = new Vec3()) {
    const invLength = 1 / vec3Length(a);
    return vec3MultiplyByScalar(a, invLength, result);
}
export function vec3Dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
export function vec3Cross(a, b, result = new Vec3()) {
    const ax = a.x;
    const ay = a.y;
    const az = a.z;
    const bx = b.x;
    const by = b.y;
    const bz = b.z;
    return result.set(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
}
export function vec3Mix(a, b, t, result = new Vec3()) {
    const s = 1 - t;
    return result.set(a.x * s + b.x * t, a.y * s + b.y * t, a.z * s + b.z * t);
}
export function vec3FromArray(array, offset = 0, result = new Vec3()) {
    return result.set(array[offset + 0], array[offset + 1], array[offset + 2]);
}
export function vec3ToArray(a, array, offset = 0) {
    array[offset + 0] = a.x;
    array[offset + 1] = a.y;
    array[offset + 2] = a.z;
}
export function vec3ToString(a) {
    return toSafeString([a.x, a.y, a.z]);
}
export function vec3Parse(text, result = new Vec3()) {
    return vec3FromArray(parseSafeFloats(text), 0, result);
}
export function hslToRGB(hsl, result = new Vec3()) {
    function hue2rgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * 6 * (2 / 3 - t);
        }
        return p;
    }
    // h,s,l ranges are in 0.0 - 1.0
    const h = ((hsl.x % 1) + 1) % 1; // euclidean modulo
    const s = Math.min(Math.max(hsl.y, 0), 1);
    const l = Math.min(Math.max(hsl.z, 0), 1);
    if (s === 0) {
        return result.set(1, 1, 1);
    }
    const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
    const q = 2 * l - p;
    return result.set(hue2rgb(q, p, h + 1 / 3), hue2rgb(q, p, h), hue2rgb(q, p, h - 1 / 3));
}
export function rgbToHSL(rgb, result = new Vec3()) {
    // h,s,l ranges are in 0.0 - 1.0
    const r = rgb.x, g = rgb.y, b = rgb.z;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue = 0;
    let saturation = 0;
    const lightness = (min + max) / 2;
    if (min === max) {
        hue = 0;
        saturation = 0;
    }
    else {
        const delta = max - min;
        saturation =
            lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
        switch (max) {
            case r:
                hue = (g - b) / delta + (g < b ? 6 : 0);
                break;
            case g:
                hue = (b - r) / delta + 2;
                break;
            case b:
                hue = (r - g) / delta + 4;
                break;
        }
        hue /= 6;
    }
    return result.set(hue, saturation, lightness);
}
export function hexToRGB(hex, result = new Vec3()) {
    hex = Math.floor(hex);
    return result.set(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}
export function rgbToHex(rgb) {
    return ((rgb.x * 255) << 16) ^ ((rgb.y * 255) << 8) ^ ((rgb.z * 255) << 0);
}
// from three.js
export function mat3ToEuler(m, result = new Vec3()) {
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    const te = m.elements;
    const m11 = te[0], m12 = te[3], m13 = te[6];
    const m21 = te[1], m22 = te[4], m23 = te[7];
    const m31 = te[2], m32 = te[5], m33 = te[8];
    result.y = Math.asin(clamp(m13, -1, 1));
    if (Math.abs(m13) < 0.9999999) {
        result.x = Math.atan2(-m23, m33);
        result.z = Math.atan2(-m12, m11);
    }
    else {
        result.x = Math.atan2(m32, m22);
        result.z = 0;
    }
    return result;
}
// from three.js
export function mat4ToEuler(m, result = new Vec3()) {
    return mat3ToEuler(mat4ToMat3(m), result);
}
export function quatToEuler(q, result = new Vec3()) {
    return mat3ToEuler(quatToMat3(q), result);
}
//# sourceMappingURL=Vec3.js.map