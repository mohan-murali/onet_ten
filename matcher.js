// PASS THROUGH GAME BOARD AND XY POSITIONS OF POTH PIECES SELECTED
function canMatch(board, p1X, p1Y, p2X, p2Y) {
    if ((p1X == p1Y) && (p2X == p2Y)) return false; // CHECK FOR SAME PIECE

    if (adjacent(board, p1X, p1Y, p2X, p2Y) || oneRA(board, p1X, p1Y, p2X, p2Y) || twoRA(board, p1X, p1Y, p2X, p2Y)) return true;
    else return false;
}

function occupied(board, X, Y) { // CHECK IF THE COORDINATE IS ALREADY OCCUPIED. IN EFFECT, BLOCKING A PATH.
    if (board[X][Y] != null) return true;
    return false;
}

function adjacent(board, p1X, p1Y, p2X, p2Y) { // CHECK IF TWO PIECES ARE ON THE SAME PLANE
    // COMPLETED BY JOSH ROGERS (JJR25)
    if (p1X == p2X) { // X EQUAL, Y VARIES
        if (Math.abs(p1Y - p2Y) == 1) return true; // NEXT TO EACH OTHER

        if (p1Y > p2Y) {
            for (let i = p2Y + 1; i < p1Y; i++) {
                if (occupied(p1X, i)) return false;
            }
            return true;
        } else if (p1Y < p2Y) {
            for (let i = p1Y + 1; i < p2Y; i++) {
                if (occupied(p1X, i)) return false;
            }
            return true;
        }
    } else if (p1Y == p2Y) { // X VARIES, Y EQUAL
        if (Math.abs(p1X - p2X) == 1) return true; // NEXT TO EACH OTHER

        if (p1X > p2X) {
            for (let i = p2X + 1; i < p1X; i++) {
                if (occupied(i, p1Y)) return false;
            }
            return true;

        } else if (p1X < p2X) {
            for (let i = p1X + 1; i < p2X; i++) {
                if (occupied(i, p1Y)) return false;
            }
            return true;
        }
    }
    return false;
}

function oneRA(board, p1X, p1Y, p2X, p2Y) {
    // COMPLETED BY JOSH ROGERS (JJR25)

    // GIVEN TWO POINTS P1(X1,Y1) AND P2(X2,Y2) THEN THE POINTS OF INTERSECTION (JOINTS) ARE
    // J1(X1,Y2) AND J2(X2,Y1)

    joint1 = {
        X: p1X,
        Y: p2Y
    };

    joint2 = {
        X: p2X,
        Y: p1Y
    }

    // IF ONE 90DEG TURN, COMPOSED OF TWO ADJACENCY CHECKS, WITH HORIZONTAL AND VERTICAL LINES MEETING AT THE JOINTS

    if (
        (adjacent(board, p1X, p1Y, joint1.X, joint1.Y) && adjacent(board, p2X, p2Y, joint.X, joint.Y))
        || (adjacent(board, p1X, p1Y, joint2.X, joint2.Y) && adjacent(board, p2X, p2Y, joint2.X, joint2.Y))
    ) return true;
    return false;
}

function twoRA(board, p1X, p1Y, p2X, p2Y) {
    // TODO: COMPLETE
}