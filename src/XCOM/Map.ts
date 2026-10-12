export let xcom_Map: Array<Array<mapTile>> = [];

export const xcom_units = Map<string, unit>;

export type tileType = "EMPTY" | "WALL";

export type mapTile = {
  type: tileType;
};

export type unit = {
  position: { x: number, y: number },
  name: string,
  health: number,
};

export function generateMap() {
  const X_SIZE = 1000;
  const Y_SIZE = 1000;
  xcom_Map = [];
  for (let x = 0; x < X_SIZE; x++) {
    xcom_Map.push([]);
    for (let y = 0; y < Y_SIZE; y++) {
      xcom_Map[x].push({ type: "EMPTY" });
    }
  }
}
