import { v4 as uuidv4 } from 'uuid';
export const behaveToFlow = (graph) => {
    const nodes = [];
    const edges = [];
    graph.nodes?.forEach((nodeJSON) => {
        const node = {
            id: nodeJSON.id,
            type: nodeJSON.type,
            position: {
                x: nodeJSON.metadata?.positionX
                    ? Number(nodeJSON.metadata?.positionX)
                    : 0,
                y: nodeJSON.metadata?.positionY
                    ? Number(nodeJSON.metadata?.positionY)
                    : 0
            },
            data: {}
        };
        nodes.push(node);
        if (nodeJSON.parameters) {
            for (const [inputKey, input] of Object.entries(nodeJSON.parameters)) {
                if ('link' in input && input.link !== undefined) {
                    edges.push({
                        id: uuidv4(),
                        source: input.link.nodeId,
                        sourceHandle: input.link.socket,
                        target: nodeJSON.id,
                        targetHandle: inputKey
                    });
                }
                if ('value' in input) {
                    node.data[inputKey] = input.value;
                }
            }
        }
        if (nodeJSON.flows) {
            for (const [inputKey, link] of Object.entries(nodeJSON.flows)) {
                edges.push({
                    id: uuidv4(),
                    source: nodeJSON.id,
                    sourceHandle: inputKey,
                    target: link.nodeId,
                    targetHandle: link.socket
                });
            }
        }
    });
    return [nodes, edges];
};
//# sourceMappingURL=behaveToFlow.js.map