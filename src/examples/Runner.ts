import * as fs from 'fs/promises';
import GraphEvaluator from '../lib/Graphs/GraphEvaluator';
import loadGraph from '../lib/Graphs/loadGraph';
import registerGenericNodes from '../lib/Nodes/Generic/GenericNodes';
import NodeRegistry from '../lib/Nodes/NodeRegistry';
import registerThreeNodes from '../lib/Nodes/Three/ThreeNodes';

async function main() {
  const nodeRegistry = new NodeRegistry();
  registerGenericNodes(nodeRegistry);
  registerThreeNodes(nodeRegistry);

  const graphJsonPath = process.argv[2];
  if (graphJsonPath === undefined) {
    throw new Error('no path specified');
  }
  console.log(`reading behavior graph: ${graphJsonPath}`);
  const textFile = await fs.readFile(graphJsonPath, { encoding: 'utf-8' });
  // console.log(textFile);
  const graph = loadGraph(JSON.parse(textFile), nodeRegistry);
  // console.log(graph);

  const graphEvaluator = new GraphEvaluator(graph);
  graphEvaluator.triggerEvents('event/sceneStart', new Map<string, any>().set('flow', true));
  graphEvaluator.executeAll();
}

main();
