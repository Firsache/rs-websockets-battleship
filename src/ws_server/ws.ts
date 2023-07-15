import { WebSocketServer } from "ws";
import WebSocket from "ws";

import { registration, disconnection } from "../ws_actions/handleRegistReq";
import { addUserToRoom, createRoom } from "../ws_actions/handleRoomReq";
import { startGame } from "../ws_actions/handleShipsReq";
import { attack, randomAttack } from "../ws_actions/handleAttack";

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
      createRoom(ws);
    } else if (request.type === "add_user_to_room") {
      addUserToRoom(ws, request);
    } else if (request.type === "add_ships") {
      startGame(ws, request);
    } else if (request.type === "attack") {
      console.log(request.data);
      attack(ws, request);
    } else if (request.type === "randomAttack") {
      console.log(request.data);
      randomAttack(ws, request);
    } else {
      ws.send("Such action in the game isn't found");
    }
  });

  ws.on("close", () => {
    disconnection(ws);
  });
});
