type State = {
    onEndEvent?: (() => void) | undefined;
};
export declare const LifecycleOnEnd: import("../../../Nodes/NodeDefinitions.js").IEventNodeDefinition<{}, {
    flow: string;
}, import("../../../index.js").NodeConfigurationDescription, State>;
export {};
