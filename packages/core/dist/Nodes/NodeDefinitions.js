import { AsyncNodeInstance } from './AsyncNode.js';
import { EventNodeInstance } from './EventNode.js';
import { FlowNodeInstance } from './FlowNode.js';
import { FunctionNodeInstance } from './FunctionNode.js';
import { makeCommonProps } from './nodeFactory.js';
import { NodeType } from './NodeInstance.js';
// HELPER FUNCTIONS
// helper function to not require you to define generics when creating a node def:
export function makeFlowNodeDefinition(definition) {
    return {
        ...definition,
        nodeFactory: (graph, config) => new FlowNodeInstance({
            ...makeCommonProps(NodeType.Flow, definition, config, graph),
            initialState: definition.initialState,
            triggered: definition.triggered
        })
    };
}
export function makeAsyncNodeDefinition(definition) {
    return {
        ...definition,
        nodeFactory: (graph, config) => new AsyncNodeInstance({
            ...makeCommonProps(NodeType.Async, definition, config, graph),
            initialState: definition.initialState,
            triggered: definition.triggered,
            dispose: definition.dispose
        })
    };
}
// helper function to not require you to define generics when creating a node def,
// and generates a factory for a node instance
export function makeFunctionNodeDefinition(definition) {
    return {
        ...definition,
        nodeFactory: (graph, nodeConfig) => new FunctionNodeInstance({
            ...makeCommonProps(NodeType.Function, definition, nodeConfig, graph),
            exec: definition.exec
        })
    };
}
export function makeEventNodeDefinition(definition) {
    return {
        ...definition,
        nodeFactory: (graph, config) => new EventNodeInstance({
            ...makeCommonProps(NodeType.Event, definition, config, graph),
            initialState: definition.initialState,
            init: definition.init,
            dispose: definition.dispose
        })
    };
}
export { NodeCategory } from './Registry/NodeCategory.js';
//# sourceMappingURL=NodeDefinitions.js.map