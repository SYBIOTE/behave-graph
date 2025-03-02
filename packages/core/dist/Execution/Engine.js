/* eslint-disable space-in-parens */
// fdfdfd
import { Assert } from '../Diagnostics/Assert.js';
import { EventEmitter } from '../Events/EventEmitter.js';
import { isAsyncNode, isEventNode } from '../Nodes/NodeInstance.js';
import { sleep } from '../sleep.js';
import { Fiber } from './Fiber.js';
import { resolveSocketValue } from './resolveSocketValue.js';
export class Engine {
    constructor(nodes) {
        this.nodes = nodes;
        // tracking the next node+input socket to execute.
        this.fiberQueue = [];
        this.asyncNodes = [];
        this.eventNodes = [];
        this.onNodeExecutionStart = new EventEmitter();
        this.onNodeExecutionEnd = new EventEmitter();
        this.executionSteps = 0;
        // collect all event nodes
        Object.values(nodes).forEach((node) => {
            if (isEventNode(node)) {
                this.eventNodes.push(node);
            }
        });
        // init all event nodes at startup
        this.eventNodes.forEach((eventNode) => {
            // evaluate input parameters
            eventNode.inputs.forEach((inputSocket) => {
                Assert.mustBeTrue(inputSocket.valueTypeName !== 'flow');
                this.executionSteps += resolveSocketValue(this, inputSocket);
            });
            this.onNodeExecutionStart.emit(eventNode);
            eventNode.init(this);
            this.executionSteps++;
            this.onNodeExecutionEnd.emit(eventNode);
        });
    }
    dispose() {
        // dispose all, possibly in-progress, async nodes
        this.asyncNodes.forEach((asyncNode) => asyncNode.dispose());
        // dispose all event nodes
        this.eventNodes.forEach((eventNode) => eventNode.dispose(this));
    }
    // asyncCommit
    commitToNewFiber(node, outputFlowSocketName, fiberCompletedListener = undefined) {
        Assert.mustBeTrue(isEventNode(node) || isAsyncNode(node));
        const outputSocket = node.outputs.find((socket) => socket.name === outputFlowSocketName);
        if (outputSocket === undefined) {
            throw new Error(`no socket with the name ${outputFlowSocketName}`);
        }
        if (outputSocket.links.length > 1) {
            throw new Error('invalid for an output flow socket to have multiple downstream links:' +
                `${node.description.typeName}.${outputSocket.name} has ${outputSocket.links.length} downlinks`);
        }
        if (outputSocket.links.length === 1) {
            const fiber = new Fiber(this, outputSocket.links[0], fiberCompletedListener);
            this.fiberQueue.push(fiber);
        }
    }
    // NOTE: This does not execute all if there are promises.
    executeAllSync(limitInSeconds = 100, limitInSteps = 100000000) {
        const startDateTime = Date.now();
        let elapsedSeconds = 0;
        let elapsedSteps = 0;
        while (elapsedSteps < limitInSteps &&
            elapsedSeconds < limitInSeconds &&
            this.fiberQueue.length > 0) {
            const currentFiber = this.fiberQueue[0];
            const startingFiberExecutionSteps = currentFiber.executionSteps;
            currentFiber.executeStep();
            elapsedSteps += currentFiber.executionSteps - startingFiberExecutionSteps;
            if (currentFiber.isCompleted()) {
                // remove first element
                this.fiberQueue.shift();
            }
            elapsedSeconds = (Date.now() - startDateTime) * 0.001;
        }
        this.executionSteps += elapsedSteps;
        return elapsedSteps;
    }
    async executeAllAsync(limitInSeconds = 100, limitInSteps = 100000000) {
        const startDateTime = Date.now();
        let elapsedSteps = 0;
        let elapsedTime = 0;
        let iterations = 0;
        do {
            if (iterations > 0) {
                // eslint-disable-next-line no-await-in-loop
                await sleep(0);
            }
            elapsedSteps += this.executeAllSync(limitInSeconds - elapsedTime, limitInSteps - elapsedSteps);
            elapsedTime = (Date.now() - startDateTime) * 0.001;
            iterations += 1;
        } while ((this.asyncNodes.length > 0 || this.fiberQueue.length > 0) &&
            elapsedTime < limitInSeconds &&
            elapsedSteps < limitInSteps);
        return elapsedSteps;
    }
}
//# sourceMappingURL=Engine.js.map