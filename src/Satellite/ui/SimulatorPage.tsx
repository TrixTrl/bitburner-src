import React, { useEffect } from "react";

import { useRerender } from "../../ui/React/hooks";
import { Grid, Input } from "@mui/material";
import { SatelliteEvents, SimulatorSatellite } from "../Satellites";

export const SimulatorPage = (): React.ReactElement => {
  useRerender(400);

  const initialMemory: number[][] = [];
  for (let i = 0; i < 32; i++) {
    initialMemory.push([]);
    for (let j = 0; j < 8; j++) {
      initialMemory[i].push(0);
    }
  }

  return <div>
    <Grid container columns={initialMemory.length}>
      {initialMemory.map((row, outerIndex) => {
        return <Grid item key={outerIndex}>
          {row.map((value, innerIndex) => {
            return MemoryCell({ x: outerIndex, y: innerIndex });
          })}
        </Grid>
      })}
    </Grid>
  </div>;
};

type MemoryCellProps = {
  x: number,
  y: number,
};

export function MemoryCell({ x, y }: MemoryCellProps): React.ReactElement {
  const rerender = useRerender();
  useEffect(() => SatelliteEvents.subscribe(() => rerender()));

  const updateCell = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (value == value) {
      SimulatorSatellite.memory[x + y * 8] = value;
      SatelliteEvents.emit();
    }
  }

  return (
    <div style={{ maxWidth:150 }}>
      <Input
        value={SimulatorSatellite.memory[x + y * 8]}
        onChange={updateCell}
      />
    </div>
  );
}
