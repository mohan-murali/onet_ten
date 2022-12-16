// PASS THROUGH GAME BOARD AND XY POSITIONS OF POTH PIECES SELECTED
import {
  Position,
  StraightConnect,
  TwoStraightConnect,
  ThreeStraightConnect,
  isAllStraightConnect,
} from "./model.js";
import { getElement } from "./utils.js";

/**
 * Checks how the tiles can be matched
 * @param {Unique Value for 1st tile} v1
 * @param {Unique Value for 2nd tile} v2
 * @param {Position of 1st tile on X-axis} p1X
 * @param {Position of 1st tile on Y-axis} p1Y
 * @param {Position of 2nd tile on X-axis} p2X
 * @param {Position of 2nd tile on X-axis} p2Y
 * @param {Number of columns} hor
 * @param {Number of rows} ver
 */
function canMatch(v1, v2, p1X, p1Y, p2X, p2Y, hor, ver) {
  if(v1 == null || v2 == null) return false;
  if (v1 !== v2) return false;
  if (p1X == p2X && p1Y == p2Y) return false; // CHECK FOR SAME PIECE

  if (
    adjacent(p1X, p1Y, p2X, p2Y) ||
    isStraightLine(p1X, p1Y, p2X, p2Y) ||
    oneRA(p1X, p1Y, p2X, p2Y) ||
    twoRA(p1X, p1Y, p2X, p2Y, hor, ver)
  ) {
    if (adjacent(p1X, p1Y, p2X, p2Y)) {
      return adjacent(p1X, p1Y, p2X, p2Y);
    }

    if (isStraightLine(p1X, p1Y, p2X, p2Y)) {
      return isStraightLine(p1X, p1Y, p2X, p2Y);
    }

    if (oneRA(p1X, p1Y, p2X, p2Y)) {
      return oneRA(p1X, p1Y, p2X, p2Y);
    }

    if (twoRA(p1X, p1Y, p2X, p2Y, hor, ver)) {
      return twoRA(p1X, p1Y, p2X, p2Y, hor, ver);
    }
  } else return false;
}

function occupied(X, Y) {
  // CHECK IF THE COORDINATE IS ALREADY OCCUPIED. IN EFFECT, BLOCKING A PATH.
  return getElement(X, Y) != null && getElement(X, Y).tileValue != null;
}

function adjacent(p1X, p1Y, p2X, p2Y) {
  // CHECK IF TWO PIECES ARE ON THE SAME PLANE
  // COMPLETED BY JOSH ROGERS (JJR25)
  if (p1X == p2X) {
    // X EQUAL, Y VARIES
    if (Math.abs(p1Y - p2Y) == 1)
      // NEXT TO EACH OTHER
      return new StraightConnect(
        new Position(p1X, p1Y),
        new Position(p2X, p2Y)
      );
  } else if (p1Y == p2Y) {
    // X VARIES, Y EQUAL
    if (Math.abs(p1X - p2X) == 1)
      return new StraightConnect(
        new Position(p1X, p1Y),
        new Position(p2X, p2Y)
      ); // NEXT TO EACH OTHER
  }
  return false;
}

/**
 * Checks if the straight line is present or not between start and end position
 * @param {Start Position on x-axis} p1X
 * @param {Start Position of on y-axis} p1Y
 * @param {End Position on x-axis} p2X
 * @param {End Position on y-axis} p2Y
 * @param {Flag to check if first right angle is present} isFirstJoint
 * @param {Flag to check if second right angle is present} isSecondJoint
 */
function isStraightLine(p1X, p1Y, p2X, p2Y, isFirstJoint, isSecondJoint) {
  if (p1X == p2X) {
    if (p1Y > p2Y) {
      for (
        let i = p2Y + (isSecondJoint ? 0 : 1);
        i < p1Y + (isFirstJoint ? 1 : 0);
        i++
      ) {
        if (occupied(p1X, i)) return false;
      }
      return new StraightConnect(
        new Position(p1X, p1Y),
        new Position(p2X, p2Y)
      );
    } else if (p1Y < p2Y) {
      for (
        let i = p1Y + (isFirstJoint ? 0 : 1);
        i < p2Y + (isSecondJoint ? 1 : 0);
        i++
      ) {
        if (occupied(p1X, i)) return false;
      }
      return new StraightConnect(
        new Position(p1X, p1Y),
        new Position(p2X, p2Y)
      );
    }
  } else if (p1Y == p2Y) {
    if (p1X > p2X) {
      for (
        let i = p2X + (isSecondJoint ? 0 : 1);
        i < p1X + (isFirstJoint ? 1 : 0);
        i++
      ) {
        if (occupied(i, p1Y)) return false;
      }
      return new StraightConnect(
        new Position(p1X, p1Y),
        new Position(p2X, p2Y)
      );
    } else if (p1X < p2X) {
      for (
        let i = p1X + (isFirstJoint ? 0 : 1);
        i < p2X + (isSecondJoint ? 1 : 0);
        i++
      ) {
        if (occupied(i, p1Y)) return false;
      }
      return new StraightConnect(
        new Position(p1X, p1Y),
        new Position(p2X, p2Y)
      );
    }
  }
  return false;
}

function oneRA(p1X, p1Y, p2X, p2Y) {
  // COMPLETED BY JOSH ROGERS (JJR25)

  // GIVEN TWO POINTS P1(X1,Y1) AND P2(X2,Y2) THEN THE POINTS OF INTERSECTION (JOINTS) ARE
  // J1(X1,Y2) AND J2(X2,Y1)

  const joint1 = {
    X: p1X,
    Y: p2Y,
  };

  const joint2 = {
    X: p2X,
    Y: p1Y,
  };

  // IF ONE 90DEG TURN, COMPOSED OF TWO ADJACENCY CHECKS, WITH HORIZONTAL AND VERTICAL LINES MEETING AT THE JOINTS

  let firstJointFirst = isStraightLine(joint1.X, joint1.Y, p1X, p1Y, true);
  let firstJointSecond = isStraightLine(joint1.X, joint1.Y, p2X, p2Y, true);
  if (isAllStraightConnect(firstJointFirst, firstJointSecond))
    return new TwoStraightConnect(firstJointFirst, firstJointSecond);

  let secondJointFirst = isStraightLine(joint2.X, joint2.Y, p1X, p1Y, true);
  let secondJointSecond = isStraightLine(joint2.X, joint2.Y, p2X, p2Y, true);
  if (isAllStraightConnect(secondJointFirst, secondJointSecond))
    return new TwoStraightConnect(secondJointFirst, secondJointSecond);

  return false;
}

/**
 * Identifies 2 right angles
 * @param {Position of first tile on x-axis} p1X
 * @param {Position of first tile on y-axis} p1Y
 * @param {Position of second tile on x-axis} p2X
 * @param {Position of second tile on y-axis} p2Y
 * @param {Number of columns} hor
 * @param {Number of rows} ver
 */
function twoRA(p1X, p1Y, p2X, p2Y, hor, ver) {
  for (let i = -1; i <= ver; i++) {
    let firstJoint = { position: [p1X, i] };
    let secondJoint = { position: [p2X, i] };
    let connecting = connectFourPoint(
      p1X,
      p1Y,
      firstJoint,
      secondJoint,
      p2X,
      p2Y
    );
    if (connecting) return connecting;
  }

  // Vertical 2 points
  for (let i = -1; i <= hor; i++) {
    let firstJoint = { position: [i, p1Y] };
    let secondJoint = { position: [i, p2Y] };
    let connecting = connectFourPoint(
      p1X,
      p1Y,
      firstJoint,
      secondJoint,
      p2X,
      p2Y
    );
    if (connecting) return connecting;
  }
  return false;
}

/**
 *
 * @param {Position of first tile on x-axis} p1X
 * @param {Position of first tile on y-axis} p1Y
 * @param {Coordinates for First right angled triangle} firstJoint
 * @param {Coordinates for Second right angled triangle} secondJoint
 * @param {Position of second tile on x-axis} p2X
 * @param {Position of second tile on y-axis} p2Y
 */
const connectFourPoint = (p1X, p1Y, firstJoint, secondJoint, p2X, p2Y) => {
  // first -> firstJoint -> secondJoint -> second
  let firstToFirstJoint = isStraightLine(
    p1X,
    p1Y,
    firstJoint.position[0],
    firstJoint.position[1],
    false,
    true
  );
  let firstJointToSecondJoint = isStraightLine(
    firstJoint.position[0],
    firstJoint.position[1],
    secondJoint.position[0],
    secondJoint.position[1],
    true,
    true
  );
  let secondJointToSecond = isStraightLine(
    secondJoint.position[0],
    secondJoint.position[1],
    p2X,
    p2Y,
    true,
    false
  );
  if (
    isAllStraightConnect(
      firstToFirstJoint,
      firstJointToSecondJoint,
      secondJointToSecond
    )
  )
    return new ThreeStraightConnect(
      firstToFirstJoint,
      firstJointToSecondJoint,
      secondJointToSecond
    );

  return false;
};

export { canMatch };
