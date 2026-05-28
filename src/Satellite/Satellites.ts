import { corruptMemory, Satellite } from "./Satellite";

export let Satellites: Satellite[] = [];

export function regenerateSatellites(amount: number) {
  Satellites = [];
  for (let i = 0; i < amount; i++) {
    Satellites.push(new Satellite);
    for (let j = 0; j < 20; j++) {
      corruptMemory(Satellites[i]);
    }
  }
}
