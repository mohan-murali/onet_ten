import {
    StraightConnect,
    TwoStraightConnect,
    ThreeStraightConnect,
  } from "./model.js";

const TILE_SIZE = 80;
const TILE_SPACE = 8;
const TILE_IMAGE_SIZE = 60;

const getElement = (x, y) => {
  for (let i of querySelectorAllAsList("td")) {
    if (i.position[0] == x && i.position[1] == y) return i;
  }
  return null;
};

const querySelectorAllAsList = (selectorName) => {
  let result = [];
  let nodeList = document.querySelectorAll(selectorName);
  for (let i = 0; i < nodeList.length; i++) {
    result.push(nodeList.item(i));
  }
  return result;
};

let canvas = document.querySelector("#game-overlay-canvas");
let context = canvas.getContext("2d");

/**
 * Draws the line between the first and second tile if they match
 * @param {First selected tile} first 
 * @param {Second selected tile} second 
 */
const drawLine = (first, second) => {
  context.beginPath();
  context.moveTo(getCenter(first.x), getCenter(first.y));
  context.lineTo(getCenter(second.x), getCenter(second.y));
  context.strokeStyle = "rgb(255, 0, 0)";
  context.lineWidth = 4;
  context.stroke();
  context.closePath();
};

/**
 * Clears the line once tiles are hidden
 */
const clearLine = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const getCenter = (coordinate) => {
  return (
    (TILE_SIZE + TILE_SPACE) * (coordinate + 1) + TILE_SIZE / 2 + TILE_SPACE / 2
  );
};

/**
 * Triggers drawing of line based on connection type
 * @param {Type of connection} connect 
 */
const drawConnect = (
    connect
  ) => {
    context.save();
    if (connect instanceof StraightConnect) drawStraightConnect(connect);

    if (connect instanceof TwoStraightConnect) {
      drawStraightConnect(connect.first);
      drawStraightConnect(connect.second);
    }

    if (connect instanceof ThreeStraightConnect) {
      drawStraightConnect(connect.first);
      drawStraightConnect(connect.second);
      drawStraightConnect(connect.third);
    }
  }

  /**
   * Draws connection between two tiles
   * @param {Connection Type} connect 
   */
  function drawStraightConnect(connect) {
    drawLine(connect.first, connect.second);
  }

export { getElement, querySelectorAllAsList, drawConnect, clearLine, TILE_IMAGE_SIZE, TILE_SIZE, TILE_SPACE };
