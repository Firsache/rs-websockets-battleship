import WebSocket from "ws";
import { Room, User, WSdata } from "../types/ts_types";
import { rooms, users } from "../ws_db/db";

export const createRoom = (ws: WebSocket) => {
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

  updateRoom();
};

const updateRoom = () => {
  const roomWithSingleUser = rooms.filter(
    (room) => room.roomUsers.length === 1
  );

  const data = {
    type: "update_room",
    data: JSON.stringify(roomWithSingleUser),
    id: 0,
  };

  users.forEach((user) => {
    user.socket.send(JSON.stringify(data));
  });
};

export const addUserToRoom = (ws: WebSocket, reqData: WSdata) => {
  const parsedReqData = JSON.parse(reqData.data);
  const userToAdd = users.find((user) => user.socket === ws);

  const roomToAdd = rooms.find(
    (room) => room.roomId === parsedReqData.indexRoom
  );

  const isUserCreator = roomToAdd.roomUsers.find(
    (user) => user.name === userToAdd.name
  );
  if (isUserCreator) return;

  if (roomToAdd.roomUsers.length === 1) {
    roomToAdd.roomUsers.push({
      name: userToAdd.name,
      index: userToAdd.index,
    });
  }

  updateRoom();
  createGame(roomToAdd);
};

const createGame = (roomToAdd: Room) => {
  roomToAdd.roomUsers.forEach((player) =>
    users.map((user) => {
      if (user.name === player.name) {
        const data = {
          type: "create_game",
          data: JSON.stringify({
            idGame: roomToAdd.roomId,
            idPlayer: user.index,
          }),
          id: 0,
        };
        user.socket.send(JSON.stringify(data));
      }
    })
  );
};
