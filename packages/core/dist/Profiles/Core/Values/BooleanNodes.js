import { makeInNOutFunctionDesc } from '../../../Nodes/FunctionNode.js';
export const Constant = makeInNOutFunctionDesc({
    name: 'math/boolean',
    label: 'Boolean',
    in: ['boolean'],
    out: 'boolean',
    exec: (a) => a
});
export const And = makeInNOutFunctionDesc({
    name: 'math/and/boolean',
    label: '∧',
    in: ['boolean', 'boolean'],
    out: 'boolean',
    exec: (a, b) => a && b
});
export const Or = makeInNOutFunctionDesc({
    name: 'math/or/boolean',
    label: '∨',
    in: ['boolean', 'boolean'],
    out: 'boolean',
    exec: (a, b) => a || b
});
export const Not = makeInNOutFunctionDesc({
    name: 'math/negate/boolean',
    label: '¬',
    in: ['boolean'],
    out: 'boolean',
    exec: (a) => !a
});
export const ToFloat = makeInNOutFunctionDesc({
    name: 'math/toFloat/boolean',
    label: 'To Float',
    in: ['boolean'],
    out: 'float',
    exec: (a) => (a ? 1 : 0)
});
export const Equal = makeInNOutFunctionDesc({
    name: 'math/equal/boolean',
    label: '=',
    in: ['boolean', 'boolean'],
    out: 'boolean',
    exec: (a, b) => a === b
});
export const toInteger = makeInNOutFunctionDesc({
    name: 'math/toInteger/boolean',
    label: 'To Integer',
    in: ['boolean'],
    out: 'integer',
    exec: (a) => (a ? 1n : 0n)
});
//# sourceMappingURL=BooleanNodes.js.map