import { GameState } from "./types/index";
import { createElement } from "./utils/createElement";
import { getNeightboursIds } from "./utils/getNeightbours";
import { getRandomIds } from "./utils/getRandomIds";
import { getTextCellColor } from "./utils/getCellTextColor";
import "./style.css";

const ID_SEPARATOR = "_";
const BOMB = "💣";
const BOOM = "💥";
const FLAG = "🚩";
const SETTINGS_HEIGHT = 120;
const MAX_CELL_SIZE = 60;
let FIRST_CLICK = true;
let FIELD_SIZE = "6";
let FIELD_MIN_SIZE = "5";
let FIELD_MAX_SIZE = "20";
let BOMB_PERCENT = 0.15;
let GAME_STATE: GameState = {};
let WIN_COUNT: number | undefined = undefined;

const app = document.querySelector<HTMLDivElement>("#app");
const gameField = createElement("div", { class: "game-field" });

const createField = (size: number) => {
  gameField.innerHTML = "";
  const windowInnerWidth = window.innerWidth - 20;
  const windowInnerHeight = window.innerHeight - SETTINGS_HEIGHT;
  const freeSpaceSize =
    windowInnerHeight > windowInnerWidth ? windowInnerWidth : windowInnerHeight;
  const calculatedCellSize = Math.floor(freeSpaceSize / size);
  const cellSize =
    calculatedCellSize > MAX_CELL_SIZE ? MAX_CELL_SIZE : calculatedCellSize;
  const cellFontSize = Math.floor(cellSize * 0.7);

  for (let x = 1; x <= size; x++) {
    const row = createElement("div", { class: "row" });
    for (let y = 1; y <= size; y++) {
      const id = `${x}${ID_SEPARATOR}${y}`;
      const cell = createElement("div", {
        class: "cell cell-closed",
        "data-id": id,
      });
      cell.style.height = `${cellSize}px`;
      cell.style.width = `${cellSize}px`;
      cell.style.fontSize = `${cellFontSize}px`;
      cell.style.lineHeight = `${cellFontSize}px`;
      row.appendChild(cell);
      GAME_STATE[id] = {
        isOpen: false,
        isFlag: false,
        isBomb: false,
        nearBombsCount: 0,
      };
    }
    gameField.appendChild(row);
  }
};

const onReload = () => {
  FIRST_CLICK = true;
  GAME_STATE = {};
  createField(Number(FIELD_SIZE));
};

const setBombs = (clickId: string) => {
  const ids = Object.keys(GAME_STATE).filter((i) => i !== clickId);
  const bombsIds = getRandomIds(ids, BOMB_PERCENT);
  bombsIds.forEach((i) => {
    GAME_STATE[i] = { ...GAME_STATE[i], isBomb: true };
  });
  WIN_COUNT = Number(FIELD_SIZE) * Number(FIELD_SIZE) - bombsIds.length;

  Object.keys(GAME_STATE).forEach((i) => {
    const neigtboursIds = getNeightboursIds(
      i,
      ID_SEPARATOR,
      Number(FIELD_SIZE)
    );
    let count = 0;
    neigtboursIds.forEach((y) => {
      if (GAME_STATE[y].isBomb) {
        count++;
      }
    });
    GAME_STATE[i] = { ...GAME_STATE[i], nearBombsCount: count };
  });
};

const addFinishScreen = (result: "win" | "defeat") => {
  const info = {
    win: {
      text: "Победа",
      class: "finish-screen-message-win",
    },
    defeat: {
      text: "Поражение",
      class: "finish-screen-message-defeat",
    },
  };

  const finishScreen = createElement("div", {
    class: "finish-screen",
  });

  const message = createElement("div", {
    class: `finish-screen-message ${info[result].class}`,
  });
  message.textContent = info[result].text;

  finishScreen.appendChild(message);
  gameField.appendChild(finishScreen);
};

const onCellClick = (id: string) => {
  const element = document.querySelector(`[data-id="${id}"]`) as HTMLElement;

  if (GAME_STATE[id].isFlag || !element) {
    return;
  }

  if (GAME_STATE[id].isBomb) {
    element.setAttribute("class", "cell cell-boom");
    element.textContent = BOOM;

    Object.entries(GAME_STATE).forEach(([key, params]) => {
      if (params.isBomb && key !== id) {
        const cell = document.querySelector(
          `[data-id="${key}"]`
        ) as HTMLElement;
        cell.textContent = BOMB;
        if (params.isFlag) {
          cell.setAttribute("class", "cell cell-bomb-with-flag");
        } else {
          cell.setAttribute("class", "cell cell-bomb");
        }
      }
    });

    addFinishScreen("defeat");
    return;
  }

  if (!GAME_STATE[id].isOpen) {
    element?.setAttribute("class", "cell cell-open");
    GAME_STATE[id] = { ...GAME_STATE[id], isOpen: true };
    if (WIN_COUNT) WIN_COUNT--;

    const nearBombsCount = GAME_STATE[id].nearBombsCount;
    if (nearBombsCount && element) {
      element.textContent = String(nearBombsCount);
      element.style.color = getTextCellColor(String(nearBombsCount));
    } else if (!nearBombsCount && element) {
      const neigtboursIds = getNeightboursIds(
        id,
        ID_SEPARATOR,
        Number(FIELD_SIZE)
      );
      neigtboursIds.forEach((i) => onCellClick(i));
    }
  }

  if (WIN_COUNT === 0) {
    addFinishScreen("win");
  }
};

const renderSettingsBlock = (parentElement: HTMLDivElement | null) => {
  const settingsWrapper = createElement("div", { class: "settings-wrapper" });

  const fieldsetSizeRange = createElement("fieldset");
  const legendSizeRange = createElement("legend", { class: "legend-text" });
  legendSizeRange.textContent = "Размер поля:";

  const fieldSizeRange = createElement("input", {
    type: "range",
    min: FIELD_MIN_SIZE,
    max: FIELD_MAX_SIZE,
    value: FIELD_SIZE,
  });
  fieldSizeRange.addEventListener("input", (e) => {
    FIELD_SIZE = (e.target as HTMLInputElement)?.value;
    onReload();
  });

  fieldsetSizeRange?.appendChild(legendSizeRange);
  fieldsetSizeRange?.appendChild(fieldSizeRange);

  const fieldsetDifficulty = createElement("fieldset");
  const legendDifficulty = createElement("legend", { class: "legend-text" });
  legendDifficulty.textContent = "Уровень сложности:";

  fieldsetDifficulty?.appendChild(legendDifficulty);

  const difficultyRadioWrapper = createElement("div", {
    class: "difficulty-radio-wrapper",
  });

  const difficultySettings = [
    { id: "1", label: "Очень легко", percent: 0.1 },
    { id: "2", label: "Легко", percent: 0.15 },
    { id: "3", label: "Нормально", percent: 0.2 },
    { id: "4", label: "Сложно", percent: 0.25 },
    { id: "5", label: "Крайне сложно", percent: 0.3 },
  ];
  difficultySettings.forEach((i) => {
    const elementWrapper = createElement("div", {
      class: "difficulty-radio-element",
    });
    const input = createElement("input", {
      type: "radio",
      name: "difficulty-radio",
      id: i.id,
      value: String(i.percent),
      class: "difficulty-radio-element-checkbox",
    });
    (input as HTMLInputElement).checked = BOMB_PERCENT === i.percent;
    input.addEventListener("change", () => {
      BOMB_PERCENT = i.percent;
      onReload();
    });

    const label = createElement("label", { for: i.id });
    label.textContent = i.label;

    elementWrapper.appendChild(input);
    elementWrapper.appendChild(label);
    difficultyRadioWrapper?.appendChild(elementWrapper);
  });

  fieldsetDifficulty?.appendChild(difficultyRadioWrapper);

  const button = createElement("button", {});
  button.innerText = "Перезапустить";
  button.addEventListener("click", () => {
    onReload();
  });

  settingsWrapper.appendChild(fieldsetSizeRange);
  settingsWrapper.appendChild(fieldsetDifficulty);
  settingsWrapper.appendChild(button);
  parentElement?.appendChild(settingsWrapper);
};

gameField.addEventListener("click", (e) => {
  const element = e.target as HTMLInputElement;
  const id = element.dataset.id;

  if (!id) return;

  if (FIRST_CLICK) {
    FIRST_CLICK = false;
    setBombs(id);
  }

  onCellClick(id);
});

gameField.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const element = e.target as HTMLInputElement;
  const id = element.dataset.id;

  if (!id || GAME_STATE[id].isOpen) return;

  if (GAME_STATE[id].isFlag) {
    GAME_STATE[id] = { ...GAME_STATE[id], isFlag: false };
    element.textContent = "";
  } else {
    GAME_STATE[id] = { ...GAME_STATE[id], isFlag: true };
    element.textContent = FLAG;
  }
});

renderSettingsBlock(app);
app?.appendChild(gameField);
onReload();
