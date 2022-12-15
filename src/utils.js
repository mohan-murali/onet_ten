const getElement = (x, y) => {
    for (let i of querySelectorAllAsList("td")) {
      if (i.position[0] == x && i.position[1] == y) return i;
    }
    return null;
  }

  const querySelectorAllAsList = (
    selectorName
  ) => {
    let result=[];
    let nodeList = document.querySelectorAll(selectorName);
    for (let i = 0; i < nodeList.length; i++) {
      result.push(nodeList.item(i));
    }
    return result;
  }

export { getElement, querySelectorAllAsList };