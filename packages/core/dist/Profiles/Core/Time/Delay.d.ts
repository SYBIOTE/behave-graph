import { Engine } from '../../../Execution/Engine.js';
import { IGraph } from '../../../Graphs/Graph.js';
import { AsyncNode } from '../../../Nodes/AsyncNode.js';
import { NodeDescription, NodeDescription2 } from '../../../Nodes/Registry/NodeDescription.js';
export declare class Delay extends AsyncNode {
    static Description: NodeDescription2;
    constructor(description: NodeDescription, graph: IGraph);
    private timeoutPending;
    triggered(engine: Engine, triggeringSocketName: string, finished: () => void): void;
    dispose(): void;
}
