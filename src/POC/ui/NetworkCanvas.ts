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
    if (node.connectedTo == -1) continue;
    ctx.beginPath();
    ctx.strokeStyle = "white";
    const startPosition = translatePos(node, canvas);
    const endPosition = translatePos(Nodes[node.connectedTo], canvas);
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(endPosition.x, endPosition.y);
    ctx.stroke();
  }
  for (const node of Nodes) {
    const drawPosition = translatePos(node, canvas);
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
};

function translatePos(node: TravelerNode, canvas: HTMLCanvasElement): { x: number, y: number } {
  const scale = 10;
  return { x: node.position.x * scale + canvas.width / 2, y: node.position.y * scale + canvas.height / 2 }
}
