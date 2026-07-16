import { Nodes } from "../POC/Nodes";
import { InternalAPI } from "../Netscript/APIWrapper";
import { Traveler as TravelerAPI, TravelerNode } from "@nsdefs";
import { helpers } from "../Netscript/NetscriptHelpers";
import { linkNode, profileBotnet } from "../POC/Node";


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
        return linkNode(linkingNodeId, targetNodeId);
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
      return profileBotnet();
    },
  }
}


