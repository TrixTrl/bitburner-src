export let XCOM_Map: Array<Array<mapTile>> = [];


export type tileType = "EMPTY" | "WALL";

export type mapTile = {
  type: tileType;
};

export function generateMap() {
  const X_SIZE = 1000;
  const Y_SIZE = 1000;
  XCOM_Map = [];
  for (let x = 0; x < X_SIZE; x++) {
    XCOM_Map.push([]);
    for (let y = 0; y < Y_SIZE; y++) {
      XCOM_Map[x].push({ type: "EMPTY" });
    }
  }
}
