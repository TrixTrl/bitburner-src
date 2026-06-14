import { assertObject } from "../utils/TypeAssertion";
import { Satellite } from "./Satellite";
import { Satellites, setLoadedSatellites } from "./Satellites";

export type SatelliteSaveFormat = {
  satellites: Satellite[];
};

export function getSatelliteSave(): SatelliteSaveFormat {
  return {
    satellites: Satellites
  };
}

export function loadSatellites(saveString: unknown): void {
  if (saveString == null || typeof saveString !== "string" || saveString === "") {
    return;
  }
  try {
    const parsedData: unknown = JSON.parse(saveString);
    assertObject(parsedData);
    const { satellites } = parsedData;
    if (!Array.isArray(satellites)) {
      throw new Error(`Invalid satellites: ${satellites}`);
    }
    setLoadedSatellites(satellites as Satellite[]);

  } catch (error) {
    console.error(error);
    console.error("Invalid Satellite data:", saveString);
  }
}
