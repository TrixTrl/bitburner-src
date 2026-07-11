import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  type PointerEventHandler,
  type WheelEventHandler,
} from "react";
import { Container, Typography, Button, Box, Tooltip } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import { throttle } from "lodash";
//import { ServerStatusBox } from "./ServerStatusBox";
import { useRerender } from "../../ui/React/hooks";
//import { DarknetEvents, DarknetState } from "../models/DarknetState";
//import { SpecialServers } from "../../Server/data/SpecialServers";
import { drawOnCanvas } from "./NetworkCanvas";
import { dnetStyles } from "../../DarkNet/ui/dnetStyles";
//import { getLabyrinthDetails, isLabyrinthServer } from "../effects/labyrinth";
//import { DarknetServer } from "../../Server/DarknetServer";
//import { getAllDarknetServers, getBackdooredDarknetServers } from "../utils/darknetNetworkUtils";
//import { ServerDetailsModal } from "./ServerDetailsModal";
//import { AutoCompleteSearchBox } from "../../ui/AutoCompleteSearchBox";
//import { getDarknetServerOrThrow } from "../utils/darknetServerUtils";
//import { getServerLogs } from "../models/packetSniffing";
//import { getTimeoutChance } from "../effects/offlineServerHandling";
//import { DocumentationLink } from "../../ui/React/DocumentationLink";
//import { Settings } from "../../Settings/Settings";

const DW_NET_WIDTH = 6000;
const DW_NET_HEIGHT = 12000;
//const initialSearchLabel = `Search:`;

export function NetworkDisplayWrapper(): React.ReactElement {
  const rerender = useRerender();
  const draggableBackground = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  //const [netDisplayDepth, setNetDisplayDepth] = useState<number>(1);
  //const [searchLabel, setSearchLabel] = useState<string>(initialSearchLabel);
  //const [serverOpened, setServerOpened] = useState<DarknetServer | null>(null);
  const zoomOptions = useMemo(() => [0.12, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 1, 1.3], []);
  const { classes } = dnetStyles({});
  //const instability = getTimeoutChance();
  //const instabilityText = instability > 0.01 ? `${(instability * 100).toFixed(1)}%` : "< 1%";
  //const darkWebRoot = getDarknetServerOrThrow(SpecialServers.DarkWeb);
  //const labDetails = getLabyrinthDetails();
  //const labyrinth = labDetails.lab;
  //const labDepth = labDetails.depth;

  /*const scrollTo = useCallback(
    (top: number, left: number) => {
      DarknetState.netViewTopScroll = top;
      DarknetState.netViewLeftScroll = left;

      draggableBackground?.current?.scrollTo({
        top: top,
        left: left,
        behavior: "instant",
      });
    },
    [draggableBackground],
  );*/

  const updateDisplay = useCallback(() => {
    if (!canvas.current) {
      return;
    }
    //const visibilityMargin = DarknetState.showFullNetwork ? 99 : 3;
    //const lab = getLabyrinthDetails().lab;
    //const startingDepth = lab && getServerLogs(lab, 1, true).length ? lab.depth : 0;
    //const deepestServerDepth = DarknetState.Network.flat().reduce(
    //  (deepest, server) => (server?.hasAdminRights && server.depth > deepest ? server.depth : deepest),
    //  startingDepth,
    //);
    //setNetDisplayDepth(deepestServerDepth + visibilityMargin);
    rerender();
    drawOnCanvas(canvas.current);
    console.log(`Drawing`);
  }, [rerender]);

  useEffect(() => {
    //const clearSubscription = DarknetEvents.subscribe(() => updateDisplay());
    draggableBackground.current?.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
    //scrollTo(DarknetState.netViewTopScroll, DarknetState.netViewLeftScroll);
    updateDisplay();

    return () => {
      //clearSubscription();
    };
  }, [updateDisplay, rerender]);

  const handleDragStart: PointerEventHandler<HTMLDivElement> = (pointerEvent) => {
    const target = pointerEvent.target as HTMLDivElement;
    const background = draggableBackground.current;
    if (target.id === "draggableBackgroundTarget") {
      background?.setPointerCapture(pointerEvent.pointerId);
    }
  };

  const handleDragEnd: PointerEventHandler<HTMLDivElement> = (pointerEvent) => {
    const target = pointerEvent.target as HTMLDivElement;
    const background = draggableBackground.current;
    if (target.id === "draggableBackgroundTarget") {
      background?.releasePointerCapture(pointerEvent.pointerId);
    }
    //DarknetEvents.emit();
  };

  const handleDrag: PointerEventHandler<HTMLDivElement> = (pointerEvent) => {
    const background = draggableBackground.current;
    if (background?.hasPointerCapture(pointerEvent.pointerId)) {
      scrollTo(background?.scrollTop - pointerEvent.movementY, (background?.scrollLeft ?? 0) - pointerEvent.movementX);
    }
  };

  const changeZoom = useCallback(
    (out = true, mouseX?: number, mouseY?: number) => {
      if (out && zoomIndex <= 0) return;
      if (!out && zoomIndex >= zoomOptions.length - 1) return;
      const newZoomIndex = out ? zoomIndex - 1 : zoomIndex + 1;
      const oldZoom = zoomOptions[zoomIndex];
      const newZoom = zoomOptions[newZoomIndex];
      //DarknetState.zoomIndex = newZoomIndex;
      setZoomIndex(newZoomIndex);
      const background = draggableBackground.current;
      const mx = mouseX ?? (background?.clientWidth ?? 0) / 2;
      const my = mouseY ?? (background?.clientHeight ?? 0) / 2;
      scrollTo(
        (((background?.scrollTop ?? 0) + my) / oldZoom) * newZoom - my,
        (((background?.scrollLeft ?? 0) + mx) / oldZoom) * newZoom - mx,
      );
    },
    [zoomIndex, setZoomIndex, zoomOptions],
  );

  const zoom = useCallback(
    (wheelEvent: WheelEvent) => {
      if (!draggableBackground.current) return;
      const rect = draggableBackground.current.getBoundingClientRect();
      const mouseX = wheelEvent.clientX - rect.left;
      const mouseY = wheelEvent.clientY - rect.top;
      changeZoom(wheelEvent.deltaY > 0, mouseX, mouseY);
    },
    [draggableBackground, changeZoom],
  );

  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // creating throttled callback only once - on mount
  const throttledZoom = useMemo(() => {
    const func = (wheelEvent: WheelEvent) => {
      zoomRef.current?.(wheelEvent);
    };
    return throttle(func, 200);
  }, []);

  const handleZoom: WheelEventHandler<HTMLDivElement> = (wheelEvent) => {
    wheelEvent.stopPropagation();
    throttledZoom(wheelEvent as unknown as WheelEvent);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <div
        className={classes.NetWrapper}
        ref={draggableBackground}
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerMove={handleDrag}
        onWheel={handleZoom}
      >
        <div
          style={{
            position: "relative",
            width: `${DW_NET_WIDTH}px`,
            height: `${DW_NET_HEIGHT}px`,
            zoom: zoomOptions[zoomIndex],
            cursor: "grab",
          }}
          id={"draggableBackgroundTarget"}
        >
          <canvas
            ref={canvas}
            width={DW_NET_WIDTH}
            height={DW_NET_HEIGHT}
            style={{ position: "absolute", zIndex: -1 }}
          ></canvas>
        </div>
      </div>
      <div className={classes.zoomContainer}>
        <Button className={classes.button} onClick={() => changeZoom(false)}>
          <ZoomIn />
        </Button>
        <Button className={classes.button} onClick={() => changeZoom()}>
          <ZoomOut />
        </Button>
      </div>
    </Container>
  );
}
