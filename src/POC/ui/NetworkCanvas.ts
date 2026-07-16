import { TravelerNode } from "@nsdefs";
import { Nodes } from "../Nodes";
import { BotnetState } from "../BotnetState";

export const drawOnCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas?.getContext("2d");
  if (!ctx || !canvas) {
    console.error("Could not get canvas context");
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  for (const node of Nodes) {
    if (node.connectedTo == -1) continue;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    const startPosition = translatePos(node, canvas.width, canvas.height);
    const endPosition = translatePos(Nodes[node.connectedTo], canvas.width, canvas.height);
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(endPosition.x, endPosition.y);
    ctx.stroke();
    const offset = setMag({ x: endPosition.x - startPosition.x, y: endPosition.y - startPosition.y }, 35);
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.ellipse(startPosition.x + offset.x, startPosition.y + offset.y, 15, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const node of Nodes) {
    const drawPosition = translatePos(node, canvas.width, canvas.height);
    //console.log(drawPosition);
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
    ctx.ellipse(drawPosition.x, drawPosition.y, 30, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (BotnetState.selectedNode) {
    const drawPosition = translatePos(BotnetState.selectedNode, canvas.width, canvas.height);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(drawPosition.x, drawPosition.y, 70, 70, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

};

export function translatePos(node: TravelerNode, width: number, height: number): { x: number, y: number } {
  const scale = 17;
  return { x: node.position.x * scale + width / 2, y: node.position.y * scale + height / 2 }
}

function setMag(vector: { x: number, y: number }, magnitude: number): { x: number, y: number } {
  const length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  if (length == 0) {
    return vector;
  }
  return { x: vector.x / length * magnitude, y: vector.y / length * magnitude }
}
