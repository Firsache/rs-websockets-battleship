import WebSocket from "ws";

export type WSdata = {
  type: string;
  data: string;
  id: number;
};

export type User = {
  name: string;
  index: number;
  password: string;
  socket: WebSocket;
  wins: number;
  ships?: Ship[];
  // enemyCoordinates?: Coordinate[];
};

export type Room = {
  roomId: number;
  roomUsers: [
    {
      name: string;
      index: number;
    }
  ];
};

export type Game = {
  gameId: number;
  players: User[];
};

export type Ship = {
  position: {
    x: number;
    y: number;
    // destroyed?: boolean;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
};
