import { Assert } from '../../../Diagnostics/Assert.js';
import { CustomEvent } from '../../../Events/CustomEvent.js';
import { EventNode2 } from '../../../Nodes/EventNode.js';
import { NodeDescription2 } from '../../../Nodes/Registry/NodeDescription.js';
import { Socket } from '../../../Sockets/Socket.js';
class OnCustomEvent extends EventNode2 {
    constructor(description, graph, configuration) {
        const customEvent = graph.customEvents[configuration.customEventId] ||
            new CustomEvent('-1', 'undefined');
        super({
            description,
            graph,
            outputs: [
                new Socket('flow', 'flow'),
                ...customEvent.parameters.map((parameter) => new Socket(parameter.valueTypeName, parameter.name, parameter.value, parameter.label))
            ],
            configuration
        });
        this.onCustomEvent = undefined;
        this.customEvent = customEvent;
        graph.customEvents[configuration.customEventId] = customEvent;
    }
    init(engine) {
        Assert.mustBeTrue(this.onCustomEvent === undefined);
        this.onCustomEvent = (parameters) => {
            this.customEvent.parameters.forEach((parameterSocket) => {
                if (!(parameterSocket.name in parameters)) {
                    throw new Error(`parameters of custom event do not align with parameters of custom event node, missing ${parameterSocket.name}`);
                }
                this.writeOutput(parameterSocket.name, parameters[parameterSocket.name]);
            });
            engine.commitToNewFiber(this, 'flow');
        };
        this.customEvent.eventEmitter.addListener(this.onCustomEvent);
    }
    dispose(engine) {
        Assert.mustBeTrue(this.onCustomEvent !== undefined);
        if (this.onCustomEvent !== undefined) {
            this.customEvent.eventEmitter.removeListener(this.onCustomEvent);
        }
    }
}
OnCustomEvent.Description = new NodeDescription2({
    typeName: 'customEvent/onTriggered',
    category: 'Event',
    label: 'On Triggered',
    configuration: {
        customEventId: {
            valueType: 'string',
            defaultValue: '-1'
        }
    },
    factory: (description, graph, configuration) => new OnCustomEvent(description, graph, configuration)
});
export { OnCustomEvent };
//# sourceMappingURL=OnCustomEvent.js.map