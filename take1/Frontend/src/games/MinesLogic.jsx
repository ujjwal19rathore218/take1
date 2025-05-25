let globalMinesArray = [];
let numberofclicks = 0;
let betamount = 0;
let minenum = 0;
let totalprofit = 0;
let mineselectnum = 0;

export const MinesLogic = (betamt, minesnumber) => {
  const length = 25;
  const arr = new Array(length).fill(1);
  numberofclicks = 0;
  totalprofit = 0;
  betamount = betamt;
  minenum = minesnumber;

  let zerosAdded = 0;
  while (zerosAdded < minesnumber) {
    const randomIndex = Math.floor(Math.random() * length);
    if (arr[randomIndex] === 1) {
      arr[randomIndex] = 0;
      zerosAdded++;
    }
  }
  globalMinesArray = arr;
  return arr;
};

export const MinesSelect = (id) => {
  const a = parseInt(id.split("-")[1]) - 1;
  if (globalMinesArray.length === 0) {
    console.error(
      "MinesLogic has not been called yet to initialize the array."
    );
    return null;
  }
  numberofclicks++;
  mineselectnum = globalMinesArray[a];
  return globalMinesArray[a];
};

export const numberclicks = () => {
  return numberofclicks;
};

export const profit = () => {
  if (mineselectnum) {
    const safespot = 25 - minenum;
    const growth = (11 * betamount * numberofclicks) / safespot;
    totalprofit = betamount + growth;
  }
  return totalprofit;
};
