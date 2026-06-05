import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";


export const satelliteStyles = makeStyles<unknown, "background">({ uniqId: "satelliteStyles" })(
  (theme: Theme) => ({
    tab: {
      paddingTop: 0,
      paddingBottom: 0,
      whiteSpace: "pre",
      height: "50px",
      minHeight: "unset",
      width: "210px",
    },
    buttonHighlight: {
      borderStyle: "solid",
      borderWidth: "8px",
      borderColor: theme.colors.success,
      padding: "0 12px",
      width: "200px",
    },
    background: {
      position: "absolute",
      opacity: 0.09,
      color: theme.colors.white,
      fontFamily: "monospace",
      fontSize: "calc(min(.65vh - 2px, 0.65vw - 2px))",
      whiteSpace: "pre",
      pointerEvents: "none",
      paddingTop: "15px",
    },
    centeredText: {
      textAlign: "center",
    },
    button: {
      borderStyle: "solid",
      borderWidth: "8px",
      borderColor: theme.colors.success,
      padding: "0 12px",
      width: "200px",
    },
    inlineFlexBox: {
      display: "inline-flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
    },
  }),
);
