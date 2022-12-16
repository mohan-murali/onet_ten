import { canMatch } from "./matcher.js";
import {
  getElement,
  querySelectorAllAsList,
  TILE_IMAGE_SIZE,
  TILE_SPACE,
  TILE_SIZE,
  drawConnect,
  clearLine,
} from "./utils.js";
import {
  StraightConnect,
  TwoStraightConnect,
  ThreeStraightConnect,
} from "./model.js";

let PAIR_AMOUNT = 0;
const UNIQUE = 43;
let HORIZONTAL = 0;
let VERTICAL = 0;
let currentTimeout = 0;

/**
 * Displays the text to the user
 * @param {text to be displayed to the user} text 
 */
const showNotifyText = (text) => {
  document.querySelector("#notify-text").style.color = "green";
  document.querySelector("#notify-text").innerHTML = text;
};

/**
 * Removes the text to be displayed
 */
const removeNotifyText = () => {
  document.querySelector("#notify-text").innerHTML = "";
};

/**
 * Creates a new table
 */
const newTableElement = () => {
  let table = document.createElement("table");
  table.style.borderSpacing = `${TILE_SPACE}px`;
  return table;
};

/**
 * Creates a new cell in table
 */
const newTableCellElement = () => {
  let td = document.createElement("td");
  td.style.width = `${TILE_SIZE}px`;
  td.style.height = `${TILE_SIZE}px`;
  return td;
};

/**
 * Adds image to a cell inside table
 * @param {tile number} num 
 */
const createDisplayElement = (num) => {
  let img = document.createElement("img");
  if (num == null) return img;
  img.style.width = `${TILE_IMAGE_SIZE}px`;
  img.style.height = `${TILE_IMAGE_SIZE}px`;
  img.src = `ben10/Alien${num}.png`;
  img.className = "tile-image";
  img.draggable = false;
  return img;
};

/**
 * Adds all the image elements inside table cell
 */
const displayAllCell = () => {
  document.querySelectorAll("td").forEach((td) => {
    td.innerHTML = "";
    td.appendChild(createDisplayElement(td.tileValue));
  });
};

/**
 * Checks if the element at the given position cooridnates is present
 * @param {Position on X-axis} x 
 * @param {Position on Y-axis} y 
 */
const isPresent = (x, y) => {
  return getElement(x, y) != null && getElement(x, y).tileValue != null;
};

/**
 * Activates the first tile on click
 */
const isFirstClick = () => {
  let anyActive = false;
  document.querySelectorAll("td").forEach((value) => {
    if (value.className.includes("active")) anyActive = true;
  });
  return anyActive;
};

/**
 * Checks if any tile is present or not
 */
const isNoMoreTile = () => {
  let tdList = querySelectorAllAsList("td");
  for (let td of tdList) {
    if (td.tileValue != null || !td.className.includes("hide")) return false;
  }
  return true;
};

/**
 * Notifies the user with the given message
 * @param {Text displayed to the user} text 
 * @param {flag to check if message should disappear automatically} isAutoDisappear 
 */
const notify = (text, isAutoDisappear) => {
  if (currentTimeout != null) clearTimeout(currentTimeout);
  showNotifyText(text);
  if (isAutoDisappear)
    currentTimeout = setTimeout(() => {
      removeNotifyText();
    });
};

/**
 * Triggers line draw when the tiles are matched and shuffles if no match is found
 * @param {First selected tile} first 
 * @param {Second selected tile} second 
 * @param {flag to check if the tiles matched} connection 
 */
const onMatch = (first, second, connection) => {
  drawConnect(connection);
  setTimeout(() => {
    removeTile(first);
    removeTile(second);
    clearLine();
    if (isNoMoreTile()) {
      notify("You win!!", false);
      displayAllCell();
    } else {
      shuffleUntilAnyMatch(HORIZONTAL, VERTICAL);
      console.log("shuffle", HORIZONTAL, VERTICAL);
    }
  }, 200);
};

/**
 * Hides the given tile when matched
 * @param {The matched tile} element 
 */
const removeTile = (element) => {
  element.className = "hide";
  element.tileValue = null;
  console.log(element);
};

/**
 * Activates the second tile if the given 2 tiles don't match
 * @param {First selected tile} first 
 * @param {Second selected tile} second 
 */
const onNotMatch = (first, second) => {
  first.className = "";
  second.className = "active";
}

/**
 * Activates the element at x,y position 
 * @param {Position on X-axis} x 
 * @param {Position on Y-axis} y 
 */
const onFirstClick = (x, y) => {
  getElement(x, y).className = "active";
};

/**
 * Returns the active element
 */
const getActive = () => {
  let activePosition = null;
  document.querySelectorAll("td").forEach((value) => {
    if (value.className.includes("active")) activePosition = value;
  });
  return activePosition;
};

/**
 * Triggers validations when second tile is clicked
 * @param {Number of columns} x 
 * @param {Number of rows} y 
 */
const onSecondClick = (x, y) => {
  let first = getActive();
  let second = getElement(x, y);

  if (first == null || second == null) return;

  if (first == second) {
    first.className = "";
    return;
  }

  let validMatched = canMatch(
    first.tileValue,
    second.tileValue,
    first.position[0],
    first.position[1],
    second.position[0],
    second.position[1],
    HORIZONTAL,
    VERTICAL
  );
  if (
    validMatched instanceof StraightConnect ||
    validMatched instanceof TwoStraightConnect ||
    validMatched instanceof ThreeStraightConnect
  ) {
    onMatch(first, second, validMatched);
  } else onNotMatch(first, second);
};

/**
 * Method triggered when a tile is clicked
 * @param {Number of columns} x 
 * @param {Number of rows} y 
 */
const onClick = (x, y) => {
  if (!isPresent(x, y)) return;
  if (isFirstClick()) onSecondClick(x, y);
  else onFirstClick(x, y);
};

/**
 * Removes the click listener from all elements and initiates a new lister to the currently clicked element
 */
const attachEventListenerAllCell = () => {
  document.querySelectorAll("td").forEach((td) => {
    td.removeEventListener("click", td.currentEventListener);
    let listener = () => {
      onClick(td.position[0], td.position[1]);
    };
    td.addEventListener("click", listener);
    td.currentEventListener = listener;
  });
};

/**
 * Shuffles the elements based on number of rows and columns
 * @param {Number of columns} x 
 * @param {Number of rows} y 
 */
const shuffle = (x, y) => {
  let tdList = querySelectorAllAsList("td");

  for (let i = tdList.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = tdList[i];
    tdList[i] = tdList[j];
    tdList[j] = temp;
  }

  document.querySelector("#game-container").innerHTML = "";

  let table = newTableElement();
  let tbody = document.createElement("tbody");

  let displayMatrix = listToMatrix(tdList, x);

  for (let i = 0; i < y; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < x; j++) {
      let td = newTableCellElement();
      td.position = [j, i];
      td.tileValue = displayMatrix[i][j].tileValue;
      if (displayMatrix[i][j].tileValue == null) td.className = "hide";
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  document.querySelector("#game-container").appendChild(table);
};

/**
 * List of shuffled elements' values
 */
const getList = () => {
  let result = [];

  for (let i = 0; i < PAIR_AMOUNT; i++) {
    result.push(i % UNIQUE);
    result.push(i % UNIQUE);
  }

  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
};

/**
 * Checks whether a match exists
 */
const isAnyMatched = () => {
  let tdList = querySelectorAllAsList("td");
  for (let i of tdList) {
    for (let j of tdList) {
      if (
        canMatch(
          i.tileValue,
          j.tileValue,
          i.position[0],
          i.position[1],
          j.position[0],
          j.position[1],
          HORIZONTAL,
          VERTICAL
        )
      )
        return true;
    }
  }
  return false;
};

/**
 * Checks if shuffling of grid is required
 * @param {Number of columns} x 
 * @param {Number of rows} y 
 */
const shuffleUntilAnyMatch = (x, y) => {
  while (!isAnyMatched()) {
    console.log("no match");
    shuffle(x, y);
  }
  displayAllCell();
  attachEventListenerAllCell();
};

/**
 * Converts the list of element values to matrix
 * @param {*} list 
 * @param {*} elementsPerSubArray 
 */
function listToMatrix(list, elementsPerSubArray) {
  let matrix = [];

  for (let i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    if (matrix[k]) {
      matrix[k].push(list[i]);
    }
  }

  return matrix;
}

/**
 * Creates a new table to display in the form of grid based on number of rows and columns
 * @param {Number of columns} x 
 * @param {Number of rows} y 
 */
const newTable = (x, y) => {
  let table = newTableElement();
  let tbody = document.createElement("tbody");

  let displayMatrix = listToMatrix(getList(), x);

  for (let i = 0; i < y; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < x; j++) {
      let td = newTableCellElement();
      td.position = [j, i];
      td.tileValue = displayMatrix[i][j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  return table;
};

/**
 * Creates the grid of game based on number of columns and rows
 * @param {Number of columns} x 
 * @param {Number of rows} y 
 */
const newGame = (x, y) => {
  PAIR_AMOUNT = (x * y) / 2;
  HORIZONTAL = x;
  VERTICAL = y;
  let mainContainer = document.querySelector("#game-container");
  mainContainer.innerHTML = "";
  mainContainer.appendChild(newTable(x, y));
  mainContainer.style.width = `${x * (TILE_SIZE + TILE_SPACE) + TILE_SPACE}px`;
  mainContainer.style.height = `${y * (TILE_SIZE + TILE_SPACE) + TILE_SPACE}px`;

  let gameOverlayCanvas = document.querySelector("#game-overlay-canvas");

  gameOverlayCanvas.style.width = `${(x + 2) * (TILE_SIZE + TILE_SPACE)}px`;
  gameOverlayCanvas.style.height = `${(y + 2) * (TILE_SIZE + TILE_SPACE)}px`;
  gameOverlayCanvas.width = (x + 2) * (TILE_SIZE + TILE_SPACE);
  gameOverlayCanvas.height = (y + 2) * (TILE_SIZE + TILE_SPACE);

  shuffleUntilAnyMatch(x, y);
  removeNotifyText();
  document.querySelector("#new-game-button").style.display = "block";
};

let gameLevel = "";

/**
 * Main method to decide game based on difficulty type
 */
const main = () => {
  document.querySelector("#new-game-button").addEventListener("click", () => {
    startGame();
  });
  document.querySelector("#easy").addEventListener("click", () => {
    var table = document.querySelector("table");
    gameLevel = "easy";
    if (table) document.querySelector("#game-container").removeChild(table);
    startGame();
  });
  document.querySelector("#medium").addEventListener("click", () => {
    var table = document.querySelector("table");
    gameLevel = "medium";
    if (table) document.querySelector("#game-container").removeChild(table);
    startGame();
  });
  document.querySelector("#hard").addEventListener("click", () => {
    var table = document.querySelector("table");
    gameLevel = "hard";
    if (table) document.querySelector("#game-container").removeChild(table);
    startGame();
  });
};

/**
 * Starts new game with specific grid based on difficulty level
 */
const startGame = () => {
  if (gameLevel == "easy") {
    newGame(4, 4);
  } else if (gameLevel == "medium") {
    newGame(6, 6);
  } else if (gameLevel == "hard") {
    newGame(8, 8);
  }
};
main();
