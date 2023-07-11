import { WebSocketServer } from "ws";
import WebSocket from "ws";

import { registration, disconnection } from "../ws_actions/handleRegistReq";
import { addUserToRoom, updateRoom } from "../ws_actions/handleRoomReq";

const WS_Port = 3000;
export const wss = new WebSocketServer({
  port: WS_Port,
});

console.log(`Start ws server on the ${WS_Port} port!`);

wss.on("connection", (ws: WebSocket) => {
  console.log("New frontent connection");

  ws.on("error", console.error);
  ws.on("message", (data: string) => {
    const request = JSON.parse(data);

    if (request.type === "reg") {
      registration(ws, request);
    } else if (request.type === "create_room") {
      updateRoom(ws);
    } else if (request.type === "add_user_to_room") {
      console.log(request.data);
      addUserToRoom(ws, request);
    } else if (request.type === "add_ships") {
      console.log(request.data);
    } else {
      ws.send("Such action in the game isn't found");
    }
  });

  ws.on("close", () => {
    // console.log("Disconnection");
    disconnection(ws);
  });
});
