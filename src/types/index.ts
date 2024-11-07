type Cell = {
  isOpen: boolean;
  isFlag: boolean;
  isBomb: boolean;
  nearBombsCount: number;
};

export type GameState = {
  [key: string]: Cell;
};
