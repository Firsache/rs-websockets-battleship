import WebSocket from "ws";
import { rooms, users } from "../ws_db/db";

const createRoom = (ws: WebSocket) => {
  //     if (roomUsers.length === 1) {
  //       updateRoom();
  //     }

  //   if (roomUsers.length > 0) return;
  const userCreator = users.find((user) => user.socket === ws);

  const data = {
    type: "create_room",
    data: "",
    id: 0,
  };

  userCreator.socket.send(JSON.stringify(data));
};

// export type Room = {
//   roomId: number;
//   roomUsers: [
//     {
//       name: string;
//       index: number;
//     }
//   ];
// };
