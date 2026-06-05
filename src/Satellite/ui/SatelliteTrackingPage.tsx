import React from "react";

import { useRerender } from "../../ui/React/hooks";
import { Grid } from "@mui/material";
import { satelliteStyles } from "./SatelliteStyles";

export const SatelliteTrackingPage = (): React.ReactElement => {
  useRerender(400);
  const { classes } = satelliteStyles({});

  function doNothing() {
  }

  return (
    <div>
      <Grid container columns={2}>
        <Grid item>
          <button onClick={doNothing} className={classes.button}>-5°</button>
          <button onClick={doNothing} className={classes.button}>-1°</button>
          <button onClick={doNothing} className={classes.button}>+1°</button>
          <button onClick={doNothing} className={classes.button}>+5°</button>
        </Grid>
        <Grid item>
          <button onClick={doNothing} className={classes.button}>-5°</button>
          <button onClick={doNothing} className={classes.button}>-1°</button>
          <button onClick={doNothing} className={classes.button}>+1°</button>
          <button onClick={doNothing} className={classes.button}>+5°</button>
        </Grid>
      </Grid>
    </div>
  );
};
