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
  // console.log(parsedReqData);    возвр { indexRoom: 1 }
  // console.log(parsedReqData.indexRoom); возвр 1

  const secondUser = users.find((user) => user.socket === ws);
  // console.log(secondUser);

  const roomToAdd = rooms.find(
    (room) => room.roomId === parsedReqData.indexRoom
  );

  // console.log(roomToAdd); возвр { roomId: 1, roomUsers: [ { name: 'userOne', index: 1 } ] }
  // console.log(roomToAdd.roomUsers);  возвр [ { name: 'userOne', index: 1 } ]
  // console.log(roomToAdd.roomUsers.length); возвр 1

  if (roomToAdd.roomUsers.length === 1) {
    roomToAdd.roomUsers.push({
      name: secondUser.name,
      index: secondUser.index,
    });
  }

  createGame(roomToAdd);
};

const createGame = (roomToAdd: Room) => {
  // console.log(roomToAdd);
  // возвр {
  //   roomId: 1,
  //   roomUsers: [ { name: 'userOne', index: 1 }, { name: 'userTwo', index: 2 } ]
  // }

  roomToAdd.roomUsers.forEach((player) =>
    users.map((user) => {
      if (user.name === player.name) {
        const data = {
          type: "create_game",
          data: {
            idGame: roomToAdd.roomId,
            idPlayer: user.index,
          },
          id: 0,
        };
        user.socket.send(JSON.stringify(data));
      }
    })
  );
};
