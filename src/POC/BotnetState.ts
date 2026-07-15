import { EventEmitter } from "../utils/EventEmitter";

export const BotnetEvents = new EventEmitter<[]>();

export const BotnetState = {
  zoomIndex: 7,
  netViewTopScroll: 0,
  netViewLeftScroll: 0,

  clickBeginX: 0,
  clickBeginY: 0,
}
