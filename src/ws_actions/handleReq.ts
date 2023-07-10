import WebSocket from "ws";

import { WSdata, User } from "../types/ts_types";
import { users } from "../ws_db/db";

const validateUser = (reqData: WSdata) => {
  const candidateName = JSON.parse(reqData.data).name;
  const isNotUnique = users.find((user) => user.name === candidateName);
  return isNotUnique
    ? { error: true, text: "User with this name is already exists" }
    : { error: false, text: "" };
};

const updateWinners = (ws: WebSocket, currentWinner: User) => {
  users.forEach((user) => {
    if (user.name === currentWinner.name) {
      user.wins = user.wins + 1;
    }
  });

  const getWinnersStat = users.map((user) => {
    return { name: user.name, wins: user.wins };
  });
  const data = {
    type: "update_winners",
    data: JSON.stringify(getWinnersStat),
    id: 0,
  };

  ws.send(JSON.stringify(data));
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
};

export const disconnection = (ws: WebSocket) => {
  const disconnectedUser = users.find((user: User) => user.socket === ws);
  //find the room to close
  const currentWinner: User = null;
  updateWinners(ws, currentWinner);

  console.log(`User${disconnectedUser} is disconnected`);
};
