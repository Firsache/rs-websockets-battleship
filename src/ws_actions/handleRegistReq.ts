import WebSocket from "ws";

import { WSdata, User } from "../types/ts_types";
import { rooms, users } from "../ws_db/db";

const validateUser = (reqData: WSdata) => {
  const candidateName = JSON.parse(reqData.data).name;
  const isNotUnique = users.find((user) => user.name === candidateName);
  return isNotUnique
    ? { error: true, text: "User with this name is already exists" }
    : { error: false, text: "" };
};

const getDbIndex = (
  ws: WebSocket,
  reqData: WSdata,
  errorData: { error: boolean; text: string }
) => {
  const userData = JSON.parse(reqData.data);

  let userIdx = null;
  if (errorData.error) {
    users.forEach((user) => {
      if (user.name === userData.name) {
        userIdx = user.index;
      }
    });
  } else {
    userIdx = users.length + 1;

    const newUser: User = {
      name: userData.name,
      index: userIdx,
      password: userData.password,
      socket: ws,
      wins: 0,
    };

    users.push(newUser);
  }
  return userIdx;
};

const sendWinnersStat = () => {
  const getWinnersStat = users.map((user) => {
    return { name: user.name, wins: user.wins };
  });
  const data = {
    type: "update_winners",
    data: JSON.stringify(getWinnersStat),
    id: 0,
  };

  users.forEach((user) => user.socket.send(JSON.stringify(data)));
};

const updateWinners = (ws: WebSocket, winnersName: string) => {
  users.forEach((user) => {
    if (user.name === winnersName) {
      user.wins = ++user.wins;
    }
  });

  sendWinnersStat();
};

export const registration = (ws: WebSocket, reqData: WSdata) => {
  const userData = JSON.parse(reqData.data);

  const error = validateUser(reqData);
  const userIndex = getDbIndex(ws, reqData, error);

  const data = {
    type: "reg",
    data: JSON.stringify({
      name: userData.name,
      index: userIndex,
      error: error.error,
      errorText: error.text,
    }),
    id: 0,
  };
  ws.send(JSON.stringify(data));

  sendWinnersStat();
};

export const disconnection = (ws: WebSocket) => {
  const disconnectedUser = users.find((user) => user.socket === ws);
  if (!disconnectedUser) return;
  console.log(`User${disconnectedUser.name} is disconnected`);

  rooms.forEach((room) => {
    const exitThisRoom = room.roomUsers.find(
      (user) => user.name === disconnectedUser.name
    );
    if (!exitThisRoom) return;

    const currentWinner = room.roomUsers.find(
      (user) => user.name !== disconnectedUser.name
    );
    console.log(`currentWinner is ${currentWinner.name}`);
    updateWinners(ws, currentWinner.name);
  });
};
