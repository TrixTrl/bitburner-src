import React, { useState } from "react";

import { useRerender } from "../../ui/React/hooks";
import { Grid, Typography } from "@mui/material";

export const SimulatorPage = (): React.ReactElement => {
  useRerender(400);


  const initialMemory: number[][] = [];
  for (let i = 0; i < 32; i++) {
    initialMemory.push([]);
    for (let j = 0; j < 8; j++) {
      initialMemory[i].push(0);
    }
  }

  const [memory, setMemory] = useState(initialMemory);


  //setMemory(initialMemory);

  return (
    <div>
      <Grid container columns={memory.length}>
        {memory.map((row, outerIndex) => {
          return <Grid item key={outerIndex}>
            {row.map((value, innerIndex) => {
              return <Typography key={innerIndex}>{value}</Typography>
            })}
          </Grid>
        })}
      </Grid>
    </div>
  )
};
