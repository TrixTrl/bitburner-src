import { Satellite as SatelliteAPI, SatelliteInfo } from "@nsdefs";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { helpers } from "../Netscript/NetscriptHelpers";
import { Satellites, satellitesGenerated } from "../Satellite/Satellites";
import { getInfo, tick } from "../Satellite/Satellite";

export function NetscriptSatellite(): InternalAPI<SatelliteAPI> {
  return {
    sendToUplink:
      (ctx: NetscriptContext) =>
        (_satellite, _address, _value): Promise<boolean> => {
          checkAccess(ctx);
          const satellite = helpers.string(ctx, "satellite", _satellite);
          const address = helpers.number(ctx, "address", _address);
          const value = helpers.number(ctx, "value", _value);
          if (address < 0 || address > 255) {
            throw helpers.errorMessage(ctx, `Memory address is out of range`);
          }
          if (value < 0 || value > 255) {
            throw helpers.errorMessage(ctx, `Value is out of range`);
          }
          if (value != Math.floor(value)) {
            throw helpers.errorMessage(ctx, `Value is not an integer`);
          }
          const satelliteObject = Satellites.find((val) => val.name == satellite);
          const lockedOn = satelliteObject?.lockedOn;
          const uploadDelay = lockedOn ? 2000 : 5000;
          return helpers.netscriptDelay(ctx, uploadDelay).then(() => {
            if (lockedOn == true) {
              if (address == 255) {
                satelliteObject.inputBuffer.push(value);
                if (satelliteObject.inputBuffer.length > 20) {
                  satelliteObject.inputBuffer.splice(1, 0);
                }
              } else {
                satelliteObject.memory[address] = value;
              }
            }
            return lockedOn == true;
          });
        },
    readBuffer:
      (ctx: NetscriptContext) =>
        (_satellite): number[] => {
          checkAccess(ctx);
          const satellite = helpers.string(ctx, "satellite", _satellite);
          const satelliteObject = Satellites.find((val) => val.name == satellite);
          if (satelliteObject == undefined) {
            throw helpers.errorMessage(ctx, `Could not find satellite`);
          }
          const buffer = satelliteObject.outputBuffer.splice(0);
          return buffer;
        },
    readSignalStrength:
      (ctx: NetscriptContext) =>
        (_horizontalAngle, _verticalAngle): Promise<Map<string, number>> => {
          checkAccess(ctx);
          const horizontalAngle = helpers.number(ctx, "horizontalAngle", _horizontalAngle) % 360;
          const verticalAngle = helpers.number(ctx, "verticalAngle", _verticalAngle);
          if (verticalAngle < 0) {
            throw helpers.errorMessage(ctx, `Vertical angle can not be negative`);
          }
          if (verticalAngle > 90) {
            throw helpers.errorMessage(ctx, `Vertical angle can not exceed 90`);
          }

          const scanDelay = 1000;
          return helpers.netscriptDelay(ctx, scanDelay).then(() => {
            const scanResult: Map<string, number> = new Map();
            for (const satelliteObject of Satellites) {
              let hDelta = horizontalAngle - satelliteObject.horizontalAngle;
              let vDelta = verticalAngle - satelliteObject.verticalAngle;
              hDelta = Math.min(Math.abs(hDelta), Math.abs(360 - hDelta));
              vDelta = Math.abs(vDelta);
              const angle = Math.sqrt(Math.pow(hDelta, 2) + Math.pow(vDelta, 2));
              if (angle < 50) {
                scanResult.set(satelliteObject.name, satelliteObject.signalStrength / Math.pow(angle, 2));
              }
            }
            return scanResult;
          });
        },
    lockOn:
      (ctx: NetscriptContext) =>
        (_satellite, _horizontalAngle, _verticalAngle, _devOverride = false): boolean => {
          checkAccess(ctx);
          const satellite = helpers.string(ctx, "satellite", _satellite);
          const horizontalAngle = helpers.number(ctx, "horizontalAngle", _horizontalAngle) % 360;
          const verticalAngle = helpers.number(ctx, "verticalAngle", _verticalAngle);
          const devOverride = helpers.boolean(ctx, "devOverride", _devOverride);
          if (verticalAngle < 0) {
            throw helpers.errorMessage(ctx, `Vertical angle can not be negative`);
          }
          if (verticalAngle > 90) {
            throw helpers.errorMessage(ctx, `Vertical angle can not exceed 90`);
          }
          const satelliteObject = Satellites.find((val) => val.name == satellite);
          if (satelliteObject == undefined) {
            throw helpers.errorMessage(ctx, `Could not find satellite`);
          }
          const angle = Math.sqrt(Math.pow(horizontalAngle - satelliteObject.horizontalAngle, 2) + Math.pow(verticalAngle - satelliteObject.verticalAngle, 2));
          if (angle < 5 || devOverride) {
            satelliteObject.lockedOn = true;
          }
          return satelliteObject.lockedOn;
        },
    tick:
      (ctx: NetscriptContext) =>
        (_satellite): void => {
          checkAccess(ctx);
          const satellite = helpers.string(ctx, "satellite", _satellite);
          const satelliteObject = Satellites.find((val) => val.name == satellite);
          if (satelliteObject == undefined) {
            throw helpers.errorMessage(ctx, `Could not find satellite`);
          }
          tick(satelliteObject);
        },
    info:
      (ctx: NetscriptContext) =>
        (_satellite): SatelliteInfo => {
          checkAccess(ctx);
          const satellite = helpers.string(ctx, "satellite", _satellite);
          const satelliteObject = Satellites.find((val) => val.name == satellite);
          if (satelliteObject == undefined) {
            throw helpers.errorMessage(ctx, `Could not find satellite`);
          }
          return getInfo(satelliteObject);
        },
    dumpMemory:
      (ctx: NetscriptContext) =>
        (_satellite): number[] => {
          checkAccess(ctx);
          const satellite = helpers.string(ctx, "satellite", _satellite);
          const satelliteObject = Satellites.find((val) => val.name == satellite);
          if (satelliteObject == undefined) {
            throw helpers.errorMessage(ctx, `Could not find satellite`);
          }
          return satelliteObject.memory;
        },
  }
}

function checkAccess(ctx: NetscriptContext) {
  if (satellitesGenerated) return;
  throw helpers.errorMessage(ctx, `You do not have access to this API`);
}
