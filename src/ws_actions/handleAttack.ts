import WebSocket from "ws";
import { WSdata } from "../types/ts_types";
// import { users } from "../ws_db/db";

export const attack = (ws: WebSocket, reqData: WSdata) => {
  const parsedReqData = JSON.parse(reqData.data);
  console.log(parsedReqData.gameId);
  console.log(parsedReqData.x);
  console.log(parsedReqData.y);
  console.log(parsedReqData.indexPlayer);

  const data = {
    type: "attack",
    data: JSON.stringify({
      position: {
        x: parsedReqData.x,
        y: parsedReqData.y,
      },
      currentPlayer: parsedReqData.indexPlayer,
      //  status: "miss" | "killed" | "shot",
    }),
    id: 0,
  };
  ws.send(JSON.stringify(data));
};

export const randomAttack = (ws: WebSocket, reqData: WSdata) => {
  const parsedReqData = JSON.parse(reqData.data);
  console.log(parsedReqData.gameId);
  console.log(parsedReqData.indexPlayer);
  const x: number = Math.round(Math.random() * 9);
  const y: number = Math.round(Math.random() * 9);

  const data = {
    type: "randomAttack",
    data: JSON.stringify({
      position: {
        x,
        y,
      },
      currentPlayer: parsedReqData.indexPlayer,
      //  status: "miss" | "killed" | "shot",
    }),
    id: 0,
  };
  ws.send(JSON.stringify(data));
};
