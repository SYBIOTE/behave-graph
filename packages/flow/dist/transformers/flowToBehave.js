const isNullish = (value) => value === undefined || value === null;
export const flowToBehave = (nodes, edges, nodeSpecJSON) => {
    const graph = { nodes: [], variables: [], customEvents: [] };
    nodes.forEach((node) => {
        if (node.type === undefined)
            return;
        const nodeSpec = nodeSpecJSON.find((nodeSpec) => nodeSpec.type === node.type);
        if (nodeSpec === undefined)
            return;
        const behaveNode = {
            id: node.id,
            type: node.type,
            metadata: {
                positionX: String(node.position.x),
                positionY: String(node.position.y)
            }
        };
        Object.entries(node.data).forEach(([key, value]) => {
            if (behaveNode.parameters === undefined) {
                behaveNode.parameters = {};
            }
            behaveNode.parameters[key] = { value: value };
        });
        edges
            .filter((edge) => edge.target === node.id)
            .forEach((edge) => {
            const inputSpec = nodeSpec.inputs.find((input) => input.name === edge.targetHandle);
            if (inputSpec && inputSpec.valueType === 'flow') {
                // skip flows
                return;
            }
            if (behaveNode.parameters === undefined) {
                behaveNode.parameters = {};
            }
            if (isNullish(edge.targetHandle))
                return;
            if (isNullish(edge.sourceHandle))
                return;
            // TODO: some of these are flow outputs, and should be saved differently.  -Ben, Oct 11, 2022
            behaveNode.parameters[edge.targetHandle] = {
                link: { nodeId: edge.source, socket: edge.sourceHandle }
            };
        });
        edges
            .filter((edge) => edge.source === node.id)
            .forEach((edge) => {
            const outputSpec = nodeSpec.outputs.find((output) => output.name === edge.sourceHandle);
            if (outputSpec && outputSpec.valueType !== 'flow') {
                return;
            }
            if (behaveNode.flows === undefined) {
                behaveNode.flows = {};
            }
            if (isNullish(edge.targetHandle))
                return;
            if (isNullish(edge.sourceHandle))
                return;
            // TODO: some of these are flow outputs, and should be saved differently.  -Ben, Oct 11, 2022
            behaveNode.flows[edge.sourceHandle] = {
                nodeId: edge.target,
                socket: edge.targetHandle
            };
        });
        // TODO filter out any orphan nodes at this point, to avoid errors further down inside behave-graph
        graph.nodes?.push(behaveNode);
    });
    return graph;
};
//# sourceMappingURL=flowToBehave.js.map