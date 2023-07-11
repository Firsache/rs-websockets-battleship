import WebSocket from "ws";
import { Room, User, WSdata } from "../types/ts_types";
import { rooms, users } from "../ws_db/db";

export const updateRoom = (ws: WebSocket) => {
  const userCreator: User = users.find((user) => user.socket === ws);

  const roomIdx: number = rooms.length + 1;

  const newRoom: Room = {
    roomId: roomIdx,
    roomUsers: [
      {
        name: userCreator.name,
        index: userCreator.index,
      },
    ],
  };

  rooms.push(newRoom);

  const data = {
    type: "update_room",
    data: JSON.stringify([newRoom]),
    id: 0,
  };

  users.forEach((user) => {
    user.socket.send(JSON.stringify(data));
  });
};

export const addUserToRoom = (ws: WebSocket, reqData: WSdata) => {
  const parsedReqData = JSON.parse(reqData.data);
  console.log(parsedReqData);
  console.log(parsedReqData.indexRoom);

  const secondUser = users.find((user) => user.socket === ws);
  console.log(secondUser);

  const roomToAdd = rooms.find(
    (room) => room.roomId === parsedReqData.indexRoom
  );
  if (roomToAdd.roomUsers.length === 1) {
    roomToAdd.roomUsers.push({
      name: secondUser.name,
      index: secondUser.index,
    });
  }

  createRoom(roomToAdd);
};

const createRoom = (roomToAdd: Room) => {
  console.log(roomToAdd);
  const data = {
    type: "create_room",
    data: "",
    id: 0,
  };

  roomToAdd.roomUsers.forEach((player) =>
    users.map((user) => {
      if (user.name === player.name) {
        user.socket.send(JSON.stringify(data));
      }
    })
  );
};
