import React, { useState } from "react";

import { useRerender } from "../../ui/React/hooks";
import { Grid } from "@mui/material";
import { satelliteStyles } from "./SatelliteStyles";
import { Theme } from "../../Themes/data/default";

export const SatelliteTrackingPage = (): React.ReactElement => {
  useRerender(400);
  const { classes } = satelliteStyles({});

  const [horizonalAngle, setHorizonalAngle] = useState(0);
  const [verticalAngle, setVerticalAngle] = useState(0);

  function modifyHorizontalAngle(delta: number) {
    setHorizonalAngle((horizonalAngle + delta + 360) % 360);
  }
  function modifyVerticalAngle(delta: number) {
    setVerticalAngle(Math.min(Math.max(verticalAngle + delta, 0), 90));
  }

  return (
    <div>
      <Grid container color={Theme.colors.info}>
        <Grid item>
          <div>
            Horiziontal Angle: {horizonalAngle}
          </div>
          <div>
            Vertical Angle: {verticalAngle}
          </div>
        </Grid>
        <Grid item>
          <div>
            <Grid container columns={2}>
              <Grid item>
                <button onClick={() => modifyHorizontalAngle(-5)} className={classes.button}>-5°</button>
                <button onClick={() => modifyHorizontalAngle(-1)} className={classes.button}>-1°</button>
                <button onClick={() => modifyHorizontalAngle(1)} className={classes.button}>+1°</button>
                <button onClick={() => modifyHorizontalAngle(5)} className={classes.button}>+5°</button>
              </Grid>
              <Grid item>
                <button onClick={() => modifyVerticalAngle(-5)} className={classes.button}>-5°</button>
                <button onClick={() => modifyVerticalAngle(-1)} className={classes.button}>-1°</button>
                <button onClick={() => modifyVerticalAngle(1)} className={classes.button}>+1°</button>
                <button onClick={() => modifyVerticalAngle(5)} className={classes.button}>+5°</button>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item>
          <div>
            Test Text
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
