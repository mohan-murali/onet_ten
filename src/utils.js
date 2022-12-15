const getElement = (x, y) => {
    for (let i of querySelectorAllAsList("td")) {
      if (i.position[0] == x && i.position[1] == y) return i;
    }
    return null;
  }

export { getElement };