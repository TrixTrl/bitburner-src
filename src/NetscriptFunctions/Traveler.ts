import { Nodes } from "../POC/Nodes";
import { InternalAPI } from "../Netscript/APIWrapper";
import { Traveler as TravelerAPI, TravelerNode } from "@nsdefs";
import { helpers } from "../Netscript/NetscriptHelpers";


export function NetscriptTraveler(): InternalAPI<TravelerAPI> {
  return {
    /**
     * Generates a new network with the given number of nodes
     */
    dev_generateFreshNetwork: (ctx) =>
      (nodeCount_): void => {
        const nodeCount = helpers.positiveNumber(ctx, "nodeCount", nodeCount_);
        Nodes.splice(0);

        Nodes.push(
          {
            id: Nodes.length,
            connectionLimit: 5,
            connectedTo: -1,
            position: { x: 0, y: 0 },
            nodeType: "NEXUS",
            power: 1,
          } as TravelerNode
        );
        while (Nodes.length < nodeCount) {
          if (Math.random() < 0.1) {
            Nodes.push(
              {
                id: Nodes.length,
                connectionLimit: 1,
                connectedTo: -1,
                position: { x: (Math.random() - .5) * 100, y: (Math.random() - .5) * 100 },
                nodeType: "MULTIPLIER",
                power: 1 + Math.random() * 3,
              } as TravelerNode
            );
          } else if (Math.random() < 0.4) {
            Nodes.push(
              {
                id: Nodes.length,
                connectionLimit: 3 + Math.floor(Math.random() * 4),
                connectedTo: -1,
                position: { x: (Math.random() - .5) * 200, y: (Math.random() - .5) * 200 },
                nodeType: "CONNECTOR",
                power: 1,
              } as TravelerNode
            );
          } else {
            Nodes.push(
              {
                id: Nodes.length,
                connectionLimit: 0,
                connectedTo: -1,
                position: { x: (Math.random() - .5) * 300, y: (Math.random() - .5) * 300 },
                nodeType: "PRODUCER",
                power: Math.random() + Math.random() + Math.random() * 2,
              } as TravelerNode
            );
          }
        }
      },
    /**
     * Generate a new node of a spesific type
     */
    dev_generateNewNode: (ctx) => (nodeType): number => {
      if (!["PRODUCER", "CONNECTOR", "MULTIPLIER"].find(type => type == nodeType)) throw new Error(`Invalid node type: ${nodeType}`);
      if (nodeType == "MULTIPLIER") {
        Nodes.push(
          {
            id: Nodes.length,
            connectionLimit: 1,
            connectedTo: -1,
            position: { x: (Math.random() - .5) * 100, y: (Math.random() - .5) * 100 },
            nodeType: "MULTIPLIER",
            power: 1 + Math.random() * 3,
          } as TravelerNode
        );
      } else if (nodeType == "CONNECTOR") {
        Nodes.push(
          {
            id: Nodes.length,
            connectionLimit: 3 + Math.floor(Math.random() * 4),
            connectedTo: -1,
            position: { x: (Math.random() - .5) * 200, y: (Math.random() - .5) * 200 },
            nodeType: "CONNECTOR",
            power: 1,
          } as TravelerNode
        );
      } else {
        Nodes.push(
          {
            id: Nodes.length,
            connectionLimit: 0,
            connectedTo: -1,
            position: { x: (Math.random() - .5) * 300, y: (Math.random() - .5) * 300 },
            nodeType: "PRODUCER",
            power: Math.random() + Math.random() + Math.random() * 2,
          } as TravelerNode
        );
      }
      return Nodes.length - 1;
    },
    /**
     * Get all nodes
     */
    getNodes: (ctx) =>
      (): TravelerNode[] => {
        return structuredClone(Nodes);
      },
    /**
     * Links one node to another, returns if the link was succesfull
     */
    linkNode: (ctx) =>
      (linkingNodeId_, targetNodeId_): boolean => {
        const linkingNodeId = helpers.number(ctx, "linkingNodeId", linkingNodeId_);
        const targetNodeId = helpers.number(ctx, "targetNodeId", targetNodeId_);
        if (linkingNodeId < 0 || linkingNodeId >= Nodes.length || targetNodeId < 0 || targetNodeId >= Nodes.length) {
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
      },
    /**
     * Unlinks node from the node it's connected to
     */
    unlinkNode: (ctx) =>
      (nodeId_): void => {
        const nodeId = helpers.number(ctx, "nodeId", nodeId_);
        if (nodeId > 0 && nodeId < Nodes.length) {
          Nodes[nodeId].connectedTo = -1;
        }
      },
    /**
     * Unlinks all nodes connected to the passed in node from said node. Returns the number of severed links
     */
    unlinkIncomming: (ctx) => (nodeId_): number => {
      const nodeId = helpers.number(ctx, "nodeId", nodeId_);
      if (nodeId >= 0 && nodeId < Nodes.length) {
        let connections = 0;
        for (const node of Nodes) {
          if (node.connectedTo == nodeId) {
            connections++;
            node.connectedTo = -1;
          }
        }
        return connections;
      } else {
        return 0;
      }
    },
    /**
     * Profiles the power of the network
     */
    profile: (ctx) => (): number => {
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
    },
  }
}

function dist(p0: { x: number, y: number }, p1: { x: number, y: number }): number {
  return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
}
