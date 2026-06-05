import React from "react";
import { Container, Tab, Tabs } from "@mui/material";

import { BorderInnerSharp, ManageSearch, History } from "@mui/icons-material";
import { satelliteStyles } from "./SatelliteStyles";
import { SatelliteTrackingPage } from "./SatelliteTrackingPage";

export function SatelliteRoot(): React.ReactElement {
  const { classes } = satelliteStyles({});
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.SyntheticEvent, tab: number): void {
    setValue(tab);
  }

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0 }}>
      <Tabs variant="fullWidth" value={value} onChange={handleChange} sx={{ minWidth: "fit-content", maxWidth: "45%" }}>
        <Tab label="Tracking" icon={<BorderInnerSharp />} iconPosition={"start"} className={classes.tab} />
        <Tab label="Assembler" icon={<ManageSearch />} iconPosition={"start"} className={classes.tab} />
        <Tab label="Simulator" icon={<History />} iconPosition={"start"} className={classes.tab} />
        </Tabs>
      {value === 0 && <SatelliteTrackingPage/>}
      {value === 1 && <div />}
      {value === 2 && <div />}
    </Container>
  );
}
