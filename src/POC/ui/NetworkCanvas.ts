import { TravelerNode } from "@nsdefs";
import { Nodes } from "../Nodes";

export const drawOnCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas?.getContext("2d");
  if (!ctx || !canvas) {
    console.error("Could not get canvas context");
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  for (const node of Nodes) {
    const drawPosition = translatePos(node, canvas);
    console.log(drawPosition);
    //const drawPosition = { x: 100, y: 100 };
    ctx.beginPath();
    switch (node.nodeType) {
      case "PRODUCER":
        ctx.fillStyle = "green";
        break;
      case "CONNECTOR":
        ctx.fillStyle = "blue";
        break;
      case "MULTIPLIER":
        ctx.fillStyle = "purple";
        break;
      case "NEXUS":
        ctx.fillStyle = "white";
        break;
    }
    //ctx.fillStyle = "blue";
    ctx.ellipse(drawPosition.x, drawPosition.y, 30, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  /*for (const server of DarknetState.Network.flat()) {
    if (
      !server ||
      // Servers in DarknetState.Network are not labyrinth servers, so it's fine to check server.depth.
      server.depth >= netDisplayDepth ||
      (!server.hasAdminRights && !server.serversOnNetwork.find((s) => getDarknetServerOrThrow(s).hasAdminRights))
    ) {
      continue;
    }

    // Draw a line between each server and its connected servers
    for (const connectedServerName of server.serversOnNetwork) {
      const connectedServer = getDarknetServerOrThrow(connectedServerName);
      // With labyrinth servers, server.depth is always -1, so we need to check labDepth.
      const connectedServerDepth = isLabyrinthServer(connectedServerName) ? labDepth : connectedServer.depth;
      if (
        connectedServerDepth >= netDisplayDepth ||
        (!connectedServer.hasAdminRights &&
          !connectedServer.serversOnNetwork.find((s) => getDarknetServerOrThrow(s).hasAdminRights))
      ) {
        continue;
      }
      ctx.beginPath();
      const connectedColor = "green";
      const disconnectedColor = "grey";
      ctx.strokeStyle = server.hasAdminRights || connectedServer.hasAdminRights ? connectedColor : disconnectedColor;
      const startPosition = getPixelPosition(server, true);
      const endPosition = getPixelPosition(connectedServer, true);
      ctx.moveTo(startPosition.left, startPosition.top);
      ctx.lineTo(endPosition.left, endPosition.top);
      ctx.stroke();
    }
  }*/
};

function translatePos(node: TravelerNode, canvas: HTMLCanvasElement): { x: number, y: number } {
  const scale = 10;
  return { x: node.position.x * scale + canvas.width / 2, y: node.position.y * scale + canvas.height / 2 }
}
