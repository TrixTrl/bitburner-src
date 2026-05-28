export class Satellite {
  name: string = randomName();
  memory: number[] = getMemory();
  buffer: number[] = [];
  lockedOn: boolean = false;
  horizontalAngle: number = Math.random() * 360;
  verticalAngle: number = Math.random() * 90;
  signalStrength: number = Math.random() * Math.random() * 100;
}

export function corruptMemory(sat: Satellite) {
  const randomMemoryValue = Math.floor(Math.random() * 255);
  sat.memory[randomMemoryValue] ^= 2 ** Math.floor(Math.random() * 8);
}

function randomName() {
  let name = "";
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (let i = 0; i < 20; i++) {
    name += letters[Math.floor(Math.random() * letters.length)];
  }
  return name;
}

function getMemory() {
  const memory = [];
  for (let i = 0; i < 256; i++) {
    memory.push(0);
  }
  return memory;
}
