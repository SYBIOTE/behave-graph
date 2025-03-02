import { FunctionNode, Socket } from '@behave-graph/core';
export class VecElements extends FunctionNode {
    constructor(description, graph, valueTypeName, elementNames = ['x', 'y', 'z', 'w'], toArray) {
        super(description, graph, [new Socket(valueTypeName, 'value')], elementNames.map((elementName) => new Socket('float', elementName)), () => {
            const value = this.readInput('value');
            const elementValues = elementNames.map(() => 0);
            toArray(value, elementValues, 0);
            elementNames.forEach((elementName, index) => this.writeOutput(elementName, elementValues[index]));
        });
    }
}
//# sourceMappingURL=VecElements.js.map