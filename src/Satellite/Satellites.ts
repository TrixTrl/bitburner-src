import { EventEmitter } from "../utils/EventEmitter";
import { corruptMemory, Satellite } from "./Satellite";

export let Satellites: Satellite[] = [];
export let satellitesGenerated = false;

export const SimulatorSatellite = new Satellite;
export const SatelliteEvents = new EventEmitter();

export function regenerateSatellites(amount: number) {
  Satellites = [];
  for (let i = 0; i < amount; i++) {
    Satellites.push(new Satellite);
    for (let j = 0; j < 20; j++) {
      corruptMemory(Satellites[i]);
    }
  }
  satellitesGenerated = true;
}

export function setLoadedSatellites(data: Satellite[]) {
  for (const sat of data) {
    Satellites.push(sat);
  }
  if (Satellites.length > 0) satellitesGenerated = true;
}
