import { makeFlowNodeDefinition } from '../../../Nodes/NodeDefinitions.js';
// https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/Blueprints/UserGuide/flow/
export const Sequence = makeFlowNodeDefinition({
    typeName: 'flow/sequence',
    label: 'Sequence',
    configuration: {
        numOutputs: {
            valueType: 'number',
            defaultValue: 4
        }
    },
    in: {
        flow: 'flow'
    },
    out: (configuration) => {
        const numOutputs = configuration.numOutputs ?? 4;
        const sockets = [];
        for (let outputIndex = 1; outputIndex <= numOutputs; outputIndex++) {
            const key = `${outputIndex}`;
            sockets.push({
                key,
                valueType: 'flow'
            });
        }
        return sockets;
    },
    initialState: undefined,
    triggered: ({ commit, outputSocketKeys }) => {
        // these outputs are fired sequentially in an sync fashion but without delays.
        // Thus a promise is returned and it continually returns a promise until each of the sequences has been executed.
        const sequenceIteration = (i) => {
            if (i < outputSocketKeys.length) {
                const outputKey = outputSocketKeys[i];
                // const outputSocket = this.outputs[i];
                commit(outputKey, () => {
                    sequenceIteration(i + 1);
                });
            }
        };
        sequenceIteration(0);
    }
});
//# sourceMappingURL=Sequence.js.map