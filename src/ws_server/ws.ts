import { WebSocketServer } from "ws";

// import { User, Room } from "../types/ts_types";
import { registration } from "./handleReq";

const WS_Port = 3000;
export const wss = new WebSocketServer({
  port: WS_Port,
});

console.log(`Start ws server on the ${WS_Port} port!`);

wss.on("connection", (ws) => {
  console.log("New frontent connection");

  ws.on("error", console.error);
  ws.on("message", (data: string) => {
    const request = JSON.parse(data);

    if (request.type === "reg") {
      registration(ws, request);
    } else if (request.type === "create_game") {
      console.log(request.data);
      registration(ws, request.data);
    } else if (request.type === "add_user_to_room") {
      console.log(request.data);
    } else if (request.type === "add_ships") {
      console.log(request.data);
    } else {
      ws.send("Such action in the game isn't found");
    }
  });

  ws.on("close", () => {
    console.log("Disconnection");
  });
});
