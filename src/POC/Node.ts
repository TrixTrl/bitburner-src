import { Nodes } from "./Nodes";

export function linkNode(linkingNodeId: number, targetNodeId: number): boolean {
  if (linkingNodeId < 0 || linkingNodeId >= Nodes.length || targetNodeId < 0 || targetNodeId >= Nodes.length) {
    return false;
  }
  if (linkingNodeId == targetNodeId) {
    return false;
  }
  if (Nodes[linkingNodeId].nodeType == "NEXUS") {
    return false;
  }
  let connections = 0;
  for (const node of Nodes) {
    if (node.connectedTo == targetNodeId) connections++;
  }
  if (Nodes[targetNodeId].connectionLimit <= connections) {
    return false;
  }
  Nodes[linkingNodeId].connectedTo = targetNodeId;
  return true;
}

export function profileBotnet(): number {
  let networkValue = 0;
  for (let i = 1; i < Nodes.length; i++) {
    const node = Nodes[i];
    if (node.nodeType != "PRODUCER") continue;
    const visited = new Set<number>();
    let runningValue = node.power;
    let searchingIndex = i;
    visited.add(searchingIndex);
    while (Nodes[searchingIndex].connectedTo != -1) {
      if (visited.has(Nodes[searchingIndex].connectedTo)) return -1;
      searchingIndex = Nodes[searchingIndex].connectedTo;
      runningValue *= Nodes[searchingIndex].power;
      runningValue /= Math.log(dist(node.position, Nodes[searchingIndex].position) + 1) / 100;
      visited.add(searchingIndex);
    }
    if (Nodes[searchingIndex].nodeType == "NEXUS") {
      networkValue += runningValue;
    }
  }
  return networkValue;
}

function dist(p0: { x: number, y: number }, p1: { x: number, y: number }): number {
  return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
}
