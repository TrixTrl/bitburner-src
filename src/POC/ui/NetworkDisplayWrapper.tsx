import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  type PointerEventHandler,
  type WheelEventHandler,
} from "react";
import { Container, Button } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import { throttle } from "lodash";
//import { ServerStatusBox } from "./ServerStatusBox";
import { useRerender } from "../../ui/React/hooks";
//import { DarknetEvents, DarknetState } from "../models/DarknetState";
//import { SpecialServers } from "../../Server/data/SpecialServers";
import { drawOnCanvas, translatePos } from "./NetworkCanvas";
import { dnetStyles } from "../../DarkNet/ui/dnetStyles";
import { BotnetState, BotnetEvents } from "../BotnetState";
import { Nodes } from "../Nodes";
import { linkNode, profileBotnet } from "../Node";
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
const DW_NET_HEIGHT = 6000;
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

  const scrollTo = useCallback(
    (top: number, left: number) => {
      return;
      BotnetState.netViewTopScroll = top;
      BotnetState.netViewLeftScroll = left;

      draggableBackground?.current?.scrollTo({
        top: top,
        left: left,
        behavior: "instant",
      });
    },
    [draggableBackground],
  );

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
    const clearSubscription = BotnetEvents.subscribe(() => updateDisplay());
    draggableBackground.current?.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
    scrollTo(BotnetState.netViewTopScroll, BotnetState.netViewLeftScroll);
    updateDisplay();

    return () => {
      clearSubscription();
    };
  }, [updateDisplay, rerender, scrollTo]);

  const handleDragStart: PointerEventHandler<HTMLDivElement> = (pointerEvent) => {
    let target = pointerEvent.target as HTMLDivElement;
    for (const child of target.children) {
      if (child.id === "botnetNetworkDisplay") {
        target = child as HTMLDivElement;
        break;
      }
    }
    const background = draggableBackground.current;
    if (target.id === "botnetNetworkDisplay") {
      background?.setPointerCapture(pointerEvent.pointerId);
    }
    BotnetState.clickBeginX = pointerEvent.clientX;
    BotnetState.clickBeginY = pointerEvent.clientY;
  };

  const handleDragEnd: PointerEventHandler<HTMLDivElement> = (pointerEvent) => {
    let target = pointerEvent.target as HTMLDivElement;
    for (const child of target.children) {
      if (child.id === "botnetNetworkDisplay") {
        target = child as HTMLDivElement;
        break;
      }
    }
    const background = draggableBackground.current;
    if (target.id === "botnetNetworkDisplay") {
      background?.releasePointerCapture(pointerEvent.pointerId);
    }
    const travelDist = Math.sqrt(Math.pow(BotnetState.clickBeginX - pointerEvent.clientX, 2) + Math.pow(BotnetState.clickBeginY - pointerEvent.clientY, 2));
    if (travelDist < 5) {
      handleClick(pointerEvent);
    }
    BotnetEvents.emit();
  };

  const handleDrag: PointerEventHandler<HTMLDivElement> = (pointerEvent) => {
    const background = draggableBackground.current;
    if (background?.hasPointerCapture(pointerEvent.pointerId)) {
      scrollTo(background?.scrollTop - pointerEvent.movementY, (background?.scrollLeft ?? 0) - pointerEvent.movementX);
    }
  };

  const handleClick: PointerEventHandler<HTMLDivElement> = (pointerEvent) => {
    //console.log({ x: pointerEvent.clientX, y: pointerEvent.clientY });
    let target = pointerEvent.target as HTMLDivElement;
    //console.log(target);
    for (const child of target.children) {
      if (child.id === "botnetNetworkDisplay") {
        target = child as HTMLDivElement;
        break;
      }
    }
    if (target.id === "botnetNetworkDisplay") {
      const rect = target.getBoundingClientRect();
      //console.log(rect);
      //console.log(BotnetState);
      const clickPosition = { x: (pointerEvent.clientX - rect.x + BotnetState.netViewLeftScroll) / zoomOptions[BotnetState.zoomIndex], y: (pointerEvent.clientY - rect.y + BotnetState.netViewTopScroll) / zoomOptions[BotnetState.zoomIndex] };
      //console.log(clickPosition);
      let smallestNode;
      let smallestDistance = Infinity;
      for (const node of Nodes) {
        const nodePosition = translatePos(node, DW_NET_WIDTH, DW_NET_HEIGHT);
        const dist = Math.sqrt(Math.pow(nodePosition.x - clickPosition.x, 2) + Math.pow(nodePosition.y - clickPosition.y, 2));
        if (dist < smallestDistance) {
          smallestDistance = dist;
          smallestNode = node;
        }
      }
      //console.log(smallestDistance);
      //console.log(smallestNode);
      if (smallestNode && smallestDistance <= 50) {
        if (!BotnetState.selectedNode) {
          BotnetState.selectedNode = smallestNode;
        } else {
          if (BotnetState.selectedNode.id == smallestNode.id) {
            BotnetState.selectedNode.connectedTo = -1;
            console.log(profileBotnet());
          } else if (linkNode(BotnetState.selectedNode.id, smallestNode.id)) {
            BotnetState.selectedNode = undefined;
            console.log(profileBotnet());
          }
        }
      } else {
        BotnetState.selectedNode = undefined;
      }
    }
  }

  const changeZoom = useCallback(
    (out = true, mouseX?: number, mouseY?: number) => {
      if (out && zoomIndex <= 0) return;
      if (!out && zoomIndex >= zoomOptions.length - 1) return;
      const newZoomIndex = out ? zoomIndex - 1 : zoomIndex + 1;
      const oldZoom = zoomOptions[zoomIndex];
      const newZoom = zoomOptions[newZoomIndex];
      BotnetState.zoomIndex = newZoomIndex;
      setZoomIndex(newZoomIndex);
      const background = draggableBackground.current;
      const mx = mouseX ?? (background?.clientWidth ?? 0) / 2;
      const my = mouseY ?? (background?.clientHeight ?? 0) / 2;
      scrollTo(
        (((background?.scrollTop ?? 0) + my) / oldZoom) * newZoom - my,
        (((background?.scrollLeft ?? 0) + mx) / oldZoom) * newZoom - mx,
      );
    },
    [zoomIndex, setZoomIndex, zoomOptions, scrollTo],
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
          id={"botnetNetworkDisplay"}
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
