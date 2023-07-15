import WebSocket from "ws";
import { Game, WSdata } from "../types/ts_types";
import { games, users } from "../ws_db/db";

export const startGame = (ws: WebSocket, reqData: WSdata) => {
  const parsedReqData = JSON.parse(reqData.data);

  const isCreated = games.find((game) => game.gameId === parsedReqData.gameId);

  if (!isCreated) {
    const userCreator = users.find((user) => user.socket === ws);
    userCreator.ships = parsedReqData.ships;

    const newGame: Game = {
      gameId: parsedReqData.gameId,
      players: [userCreator],
    };

    games.push(newGame);
  } else {
    const secondUser = users.find((user) => user.socket === ws);
    secondUser.ships = parsedReqData.ships;

    isCreated.players.push(secondUser);

    if (isCreated.players.length !== 2) return;
    isCreated.players.forEach((player) => {
      const currentUser = users.find((user) => user.name === player.name);
      const whoBegins: number = Math.round(Math.random() + 1);

      const data = {
        type: "start_game",
        data: JSON.stringify({
          ships: JSON.stringify(currentUser.ships),
          currentPlayerIndex: currentUser.index,
        }),
        id: 0,
      };
      currentUser.socket.send(JSON.stringify(data));
      turn(currentUser.socket, whoBegins);
    });
  }
};

export const turn = (ws: WebSocket, userIdx: number) => {
  const data = {
    type: "turn",
    data: JSON.stringify({ currentPlayer: userIdx }),
    id: 0,
  };

  ws.send(JSON.stringify(data));
};
