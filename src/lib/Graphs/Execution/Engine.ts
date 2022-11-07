/* eslint-disable space-in-parens */

import { EventEmitter } from '../../Events/EventEmitter.js';
import { AsyncNode } from '../../Nodes/AsyncNode.js';
import { EventNode } from '../../Nodes/EventNode.js';
import { Node } from '../../Nodes/Node.js';
import { sleep } from '../../sleep.js';
import { Graph } from '../Graph.js';
import { Fiber } from './Fiber.js';

export class Engine {
  // tracking the next node+input socket to execute.
  private readonly fiberQueue: Fiber[] = [];
  public readonly asyncNodes: AsyncNode[] = [];
  public readonly eventNodes: EventNode[] = [];
  public readonly onNodeExecution = new EventEmitter<Node>();

  constructor(public readonly graph: Graph) {
    // collect all event nodes
    Object.values(graph.nodes).forEach((node) => {
      if (node instanceof EventNode) {
        this.eventNodes.push(node);
      }
    });
    // init all event nodes at startup
    this.eventNodes.forEach((eventNode) => eventNode.init(this));
  }

  dispose() {
    // cancel all in progress async nodes
    this.asyncNodes.forEach((asyncNode) => {
      asyncNode.cancelled();
    });

    // dispose all event nodes
    Object.values(this.graph.nodes).forEach((node) => {
      if (node instanceof EventNode) {
        node.dispose(this);
      }
    });
  }

  // asyncCommit
  commitToNewFiber(
    node: Node,
    outputFlowSocketName: string,
    fiberCompletedListener: (() => void) | undefined = undefined
  ) {
    const outputSocket = node.outputSockets.find(
      (socket) => socket.name === outputFlowSocketName
    );
    if (outputSocket === undefined) {
      throw new Error(`no socket with the name ${outputFlowSocketName}`);
    }
    if (outputSocket.links.length > 1) {
      throw new Error(
        'invalid for an output flow socket to have multiple downstream links:' +
          `${node.description.typeName}.${outputSocket.name} has ${outputSocket.links.length} downlinks`
      );
    }
    if (outputSocket.links.length === 1) {
      const fiber = new Fiber(
        this,
        outputSocket.links[0],
        fiberCompletedListener
      );
      this.fiberQueue.push(fiber);
    }
  }

  // NOTE: This does not execute all if there are promises.
  executeAllSync(limitInSeconds = 100, limitInSteps = 100000000): number {
    const startDateTime = Date.now();
    let elapsedSeconds = 0;
    let elapsedSteps = 0;
    while (
      elapsedSteps < limitInSteps &&
      elapsedSeconds < limitInSeconds &&
      this.fiberQueue.length > 0
    ) {
      const currentExecutionBlock = this.fiberQueue[0];
      const localExecutionSteps = currentExecutionBlock.executeStep();
      if (localExecutionSteps < 0) {
        // remove first element
        this.fiberQueue.shift();
      }
      elapsedSeconds = (Date.now() - startDateTime) * 0.001;
      if (localExecutionSteps > 0) {
        elapsedSteps += localExecutionSteps;
      }
    }
    return elapsedSteps;
  }

  async executeAllAsync(
    limitInSeconds = 100,
    limitInSteps = 100000000
  ): Promise<number> {
    const startDateTime = Date.now();
    let elapsedSteps = 0;
    let elapsedTime = 0;
    let iterations = 0;
    do {
      if (iterations > 0) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(0);
      }
      elapsedSteps += this.executeAllSync(
        limitInSeconds - elapsedTime,
        limitInSteps - elapsedSteps
      );
      elapsedTime = (Date.now() - startDateTime) * 0.001;
      iterations += 1;
    } while (
      (this.asyncNodes.length > 0 || this.fiberQueue.length > 0) &&
      elapsedTime < limitInSeconds &&
      elapsedSteps < limitInSteps
    );

    return elapsedSteps;
  }
}
