import React, { useState } from "react";

import { useRerender } from "../../ui/React/hooks";
import { Typography } from "@mui/material";

export const AssemblerPage = (): React.ReactElement => {
  useRerender(400);

  const [codeWindowContent, setCodeWindowContent] = useState('');

  function assemble(input: string) {
    let output = "";
    const map = new Map<string, number>();
    const file = input.split('\n');
    for (let i = 0; i < file.length; i++) {
      const line = file[i].split(' ');
      let index = 0;
      if (line[0].charAt(0) == '#') {
        if (line.length < 2) {
          output += "\nError: Expected value in definition of token \"" + line[0] + "\"";
          return output;
        }
        map.set(line[0], parseInt(line[1]));
        continue;
      }
      switch (line[index]) {
        case "NOP":
          {
            output += "0x0";
            break;
          }
        case "MOV":
          {
            output += "0x1";
            break;
          }
        case "LDI":
          {
            output += "0x2";
            break;
          }
        case "ADD":
          {
            output += "0x3";
            break;
          }
        case "SUB":
          {
            output += "0x4";
            break;
          }
        case "MUL":
          {
            output += "0x5";
            break;
          }
        case "DIV":
          {
            output += "0x6";
            break;
          }
        case "AND":
          {
            output += "0x7";
            break;
          }
        case "OR":
          {
            output += "0x8";
            break;
          }
        case "XOR":
          {
            output += "0x9";
            break;
          }
        case "NAND":
          {
            output += "0xA";
            break;
          }
        case "JMP":
          {
            output += "0xB";
            break;
          }
        case "JEZ":
          {
            output += "0xC";
            break;
          }
        case "JGZ":
          {
            output += "0xD";
            break;
          }
        case "JLZ":
          {
            output += "0xE";
            break;
          }
        case "JPM":
          {
            output += "0xF";
            break;
          }
        default:
          output += "Unexpected token: " + line[index];
          return output;
      }
      index++;
      let mapValue = map.get(line[index]);
      if (mapValue) {
        output += "0123456789ABCDEF"[mapValue % 0xF] + " ";
      } else {
        output += "0123456789ABCDEF"[parseInt(line[index]) % 0xF] + " ";
      }
      index++;
      mapValue = map.get(line[index]);
      if (mapValue) {
        output += convertToHex(mapValue) + " ";
      } else {
        output += convertToHex(parseInt(line[index])) + " ";
      }
      index++;
      mapValue = map.get(line[index]);
      if (mapValue) {
        output += convertToHex(mapValue) + " ";
      } else {
        output += convertToHex(parseInt(line[index])) + " ";
      }
      output += "\n";
    }

    return output;
    function convertToHex(value: number) {
      let output = "0x";
      output += "0123456789ABCDEF"[Math.floor(value / 16)];
      output += "0123456789ABCDEF"[value % 16];
      return output;
    }
  }

  return (
    <div>
      <textarea
        value={codeWindowContent}
        onChange={e => setCodeWindowContent(e.target.value)}
      />
      <div style={{ color: "#00AA00", fontSize: "26px" }}>{assemble(codeWindowContent).split("\n").map((i, key) => {
        return <Typography key={key}>{i}</Typography>;
      })}</div>
    </div>
  )
};
