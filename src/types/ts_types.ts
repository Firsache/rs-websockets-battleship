export type WSdata = {
  type: string;
  data: string;
  id: number;
};

export type User = {
  name: string;
  index: number;
  password: string;
  // wins: number;
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
