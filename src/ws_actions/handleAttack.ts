import WebSocket from "ws";
import { WSdata, Ship } from "../types/ts_types";
import { games } from "../ws_db/db";
import { turn } from "./handleShipsReq";

export const attack = (reqData: WSdata) => {
  const parsedReqData = JSON.parse(reqData.data);
  const attackResult = getNextTurn(
    parsedReqData.gameId,
    parsedReqData.indexPlayer,
    parsedReqData.x,
    parsedReqData.y
  );
  const { status, whoseTurn, currentGame } = attackResult;
  // const currentGame = games.find(
  //   (game) => game.gameId === parsedReqData.gameId
  // );

  // const currentPlayer = currentGame.players.find(
  //   (player) => player.index === parsedReqData.indexPlayer
  // );
  // if (currentGame.turn !== currentPlayer.index) return;

  // const emeny = currentGame.players.find(
  //   (player) => player.index !== parsedReqData.indexPlayer
  // );

  // if (!currentPlayer.enemyCoordinates) {
  //   const allEnemyPositions = getShipsCoordinates(emeny.ships);
  //   currentPlayer.enemyCoordinates = allEnemyPositions;
  // }

  // let status = "";

  // const isAimed = currentPlayer.enemyCoordinates.find((data) =>
  //   data.positions.find(
  //     (coord) => coord.x === parsedReqData.x && coord.y === parsedReqData.y
  //   )
  // );
  // // console.log(`isAimed: ${isAimed}`);
  // if (!isAimed) {
  //   status = "miss";
  // } else if (isAimed?.alive === 1) {
  //   status = "killed";
  //   const killedShipPosition = isAimed.positions.find(
  //     (coord) => coord.x === parsedReqData.x && coord.y === parsedReqData.y
  //   );
  //   console.log(`killedShipPosition: ${killedShipPosition}`);
  //   killedShipPosition.destroyed = true;
  // } else {
  //   isAimed.alive = isAimed.alive - 1;
  //   status = "shot";
  // }
  // const whoseTurn =
  //   status === "killed" || status === "shot"
  //     ? currentPlayer.index
  //     : emeny.index;

  const data = {
    type: "attack",
    data: JSON.stringify({
      position: {
        x: parsedReqData.x,
        y: parsedReqData.y,
      },
      currentPlayer: parsedReqData.indexPlayer,
      status,
    }),
    id: 0,
  };

  currentGame.players.forEach((player) => {
    player.socket.send(JSON.stringify(data));
    turn(player.socket, whoseTurn);
  });
};

export const randomAttack = (ws: WebSocket, reqData: WSdata) => {
  const parsedReqData = JSON.parse(reqData.data);
  console.log(parsedReqData);

  const x: number = Math.round(Math.random() * 9);
  const y: number = Math.round(Math.random() * 9);

  const attackResult = getNextTurn(
    parsedReqData.gameId,
    parsedReqData.indexPlayer,
    x,
    y
  );
  const { status, whoseTurn, currentGame } = attackResult;

  const data = {
    type: "randomAttack",
    data: JSON.stringify({
      position: {
        x,
        y,
      },
      currentPlayer: parsedReqData.indexPlayer,
      status,
    }),
    id: 0,
  };

  currentGame.players.forEach((player) => {
    player.socket.send(JSON.stringify(data));
    turn(player.socket, whoseTurn);
  });
};

const getShipsCoordinates = (arrEnemyShips: Ship[]) => {
  const coordinatesData = [];

  arrEnemyShips.find(({ position, direction, length }) => {
    if (length === 1) {
      coordinatesData.push({ alive: 1, positions: [position] });
    } else {
      const shipCoorditanes = [];
      const shipBeginningCoordinate = position;

      shipCoorditanes.push(shipBeginningCoordinate);

      for (let i = 0; i < length; i++) {
        if (direction === false) {
          const shipPartCoordinate = { x: position.x + 1, y: position.y };
          shipCoorditanes.push(shipPartCoordinate);
        } else {
          const shipPartCoordinate = { x: position.x, y: position.y + 1 };
          shipCoorditanes.push(shipPartCoordinate);
        }
      }

      coordinatesData.push({
        alive: shipCoorditanes.length,
        positions: shipCoorditanes,
      });
    }
  });
  return coordinatesData;
};

const getNextTurn = (parsedGameId, parsedIndexPlayer, xPosition, yPosition) => {
  let status = "";

  const currentGame = games.find((game) => game.gameId === parsedGameId);

  const currentPlayer = currentGame.players.find(
    (player) => player.index === parsedIndexPlayer
  );
  if (currentGame.turn !== currentPlayer.index) return;

  const emeny = currentGame.players.find(
    (player) => player.index !== parsedIndexPlayer
  );

  if (!currentPlayer.enemyCoordinates) {
    const allEnemyPositions = getShipsCoordinates(emeny.ships);
    currentPlayer.enemyCoordinates = allEnemyPositions;
  }

  const isAimed = currentPlayer.enemyCoordinates.find((data) =>
    data.positions.find(
      (coord) => coord.x === xPosition && coord.y === yPosition
    )
  );
  // console.log(`isAimed: ${isAimed}`);
  if (!isAimed) {
    status = "miss";
  } else if (isAimed?.alive === 1) {
    status = "killed";
    const killedShipPosition = isAimed.positions.find(
      (coord) => coord.x === xPosition && coord.y === yPosition
    );
    console.log(`killedShipPosition: ${killedShipPosition}`);
    killedShipPosition.destroyed = true;
  } else {
    isAimed.alive = isAimed.alive - 1;
    status = "shot";
  }

  const whoseTurn =
    status === "killed" || status === "shot"
      ? currentPlayer.index
      : emeny.index;

  return { status, whoseTurn, currentGame };
};
