import { canMatch } from "./matcher.js";
import { getElement, querySelectorAllAsList } from "./utils.js";
import { StraightConnect, TwoStraightConnect, ThreeStraightConnect } from "./model.js";

const TILE_SIZE = 80;
const TILE_SPACE = 8;
const TILE_IMAGE_SIZE = 60;
let PAIR_AMOUNT = 0;
const UNIQUE = 43;
let HORIZONTAL = 0;
let VERTICAL = 0;
let currentTimeout = 0;


const showNotifyText = (text) => {
    document.querySelector('#notify-text').innerHTML = text
  }

const removeNotifyText =()=> {
    document.querySelector('#notify-text').innerHTML = ""
}

const newTableElement = () => {
    let table = document.createElement("table");
    table.style.borderSpacing = `${TILE_SPACE}px`;
    return table;
}

const newTableCellElement = () => {
    let td = document.createElement("td");
    td.style.width = `${TILE_SIZE}px`
    td.style.height = `${TILE_SIZE}px`
    return td;
}

const createDisplayElement = num => {
    let img = document.createElement("img");
    if (!num) return img;
    img.style.width = `${TILE_IMAGE_SIZE}px`
    img.style.height = `${TILE_IMAGE_SIZE}px`
    img.src = `ben10/Alien${num}.png`;
    img.className = "tile-image"
    img.draggable = false
    return img;
}

const displayAllCell = () => {
    document.querySelectorAll("td").forEach((td) => {
      td.innerHTML = "";
      td.appendChild(createDisplayElement(td.tileValue));
    });
  }

const  isPresent = (x, y) => {
    return getElement(x, y) != null && getElement(x, y).tileValue != null;
  }

const isFirstClick =()=> {
    let anyActive = false;
    document.querySelectorAll("td").forEach((value) => {
        if (value.className.includes("active")) anyActive = true;
    });
    return anyActive;
}

const isNoMoreTile = () => {
    let tdList = querySelectorAllAsList("td");
    for (let td of tdList) {
      if (td.tileValue != null || !td.className.includes("hide")) return false;
    }
    return true;
  }

const notify = (text, isAutoDisappear) => {
    if (currentTimeout != null) clearTimeout(currentTimeout);
    showNotifyText(text)
    if (isAutoDisappear)
        currentTimeout = setTimeout(() => {
        removeNotifyText()
        })
}


const onMatch = (
    first,
    second,
    connection
  ) => {
    // drawConnect(connection);
    setTimeout(() => {
      removeTile(first);
      removeTile(second);
    //   clearLine();
      if (isNoMoreTile()) {
        notify("You win!!", false);
        displayAllCell();
      } else {
        shuffleUntilAnyMatch(HORIZONTAL, VERTICAL);
      }
    }, 200);
  }

  const removeTile = (element) => {
    element.className = "hide";
    element.tileValue = null;
    console.log(element)
  }

  const onNotMatch = (first, second) => {
    first.className = "";
    second.className = "active";
  }


const onFirstClick = (x, y) => {
    getElement(x, y).className = "active";
  }

  const getActive = () => {
    let activePosition = null;
    document.querySelectorAll("td").forEach((value) => {
      if (value.className.includes("active")) activePosition = value;
    });
    return activePosition;
  }

const onSecondClick = (x, y) => {
    let first = getActive();
    let second = getElement(x, y);

    if (first == null || second == null) return;

    if (first == second) {
      first.className = "";
      return;
    }

    let validMatched = canMatch(first.tileValue, second.tileValue, first.position[0], first.position[1], second.position[0], second.position[1], HORIZONTAL, VERTICAL);
    if (
      validMatched instanceof StraightConnect ||
      validMatched instanceof TwoStraightConnect ||
      validMatched instanceof ThreeStraightConnect
    ) {
      onMatch(first, second, validMatched);
    } else onNotMatch(first, second);
  }

const onClick = (x, y) => {
    if (!isPresent(x, y)) return;
    if (isFirstClick()) onSecondClick(x, y);
    else onFirstClick(x, y);
  }

const attachEventListenerAllCell = () => {
    document.querySelectorAll("td").forEach((td) => {
      td.removeEventListener("click", td.currentEventListener);
      let listener = () => {
        onClick(td.position[0], td.position[1]);
      };
      td.addEventListener("click", listener);
        td.currentEventListener = listener;
    });
  }

const shuffle = (x,y) => {
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
}

const getList = ()=> {
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
  }

  const isAnyMatched = ()=> {
    let tdList = querySelectorAllAsList("td");
    for (let i of tdList) {
      for (let j of tdList) {
        if (canMatch(i.tileValue, j.tileValue, i.position[0], i.position[1], j.position[0], j.position[1]), HORIZONTAL, VERTICAL) return true;
      }
    }
    return false;
  }

const shuffleUntilAnyMatch = (x,y) => {
    while (!isAnyMatched()) shuffle(x,y);
    displayAllCell();
    attachEventListenerAllCell();
  }

  function listToMatrix(list, elementsPerSubArray) {
    let matrix = [];

    for (let i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }

      if(matrix[k]){
        matrix[k].push(list[i]);
      }
    }

    return matrix;
  }


  const newTable = (x,y)=> {
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
  }

const newGame=(x,y) => {
    PAIR_AMOUNT = (x*y)/2;
    HORIZONTAL = x;
    VERTICAL = y;
    let mainContainer = document.querySelector("#game-container");
    mainContainer.innerHTML = "";
    mainContainer.appendChild(newTable(x, y));
    mainContainer.style.width = `${
        x * (TILE_SIZE + TILE_SPACE) + TILE_SPACE
      }px`;
      mainContainer.style.height = `${
        y * (TILE_SIZE + TILE_SPACE) + TILE_SPACE
      }px`;

      let gameOverlayCanvas = document.querySelector("#game-overlay-canvas");

      gameOverlayCanvas.style.width = `${
        (x + 2) * (TILE_SIZE + TILE_SPACE)
      }px`;
      gameOverlayCanvas.style.height = `${
        (y + 2) * (TILE_SIZE + TILE_SPACE)
      }px`;
      gameOverlayCanvas.width = (x + 2) * (TILE_SIZE + TILE_SPACE);
      gameOverlayCanvas.height = (y + 2) * (TILE_SIZE + TILE_SPACE);

      shuffleUntilAnyMatch(x,y);
      removeNotifyText();
}


const main = () => {
    newGame(4,4);
    document.querySelector("#new-game-button").addEventListener("click", () => {
        newGame(4,4);
    });
}

main();