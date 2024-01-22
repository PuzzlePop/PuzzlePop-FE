const findXUp = (nowShape, preShape, width) => {
  // console.log(nowShape, preShape);
  const nL = nowShape.leftTab;
  const nR = nowShape.rightTab;
  const pL = preShape.leftTab;
  const pR = preShape.rightTab;
  // console.log("nL, nR, pL, pR: ", nL, nR, pL, pR);
  let xUp = 0;

  if (nL === pL && nR === pR) {
    xUp = 0;
  } else if (nL === nR && pL === pR) {
    xUp = 0;
  } else {
    if (nR === 0 || (nR === 1 && pR === 1)) {
      xUp = 0.05 * width * nL * -1;
    } else if (nR === 1 && pR === -1) {
      xUp = nL === pL ? width * 0.05 : width * 0.1;
    } else if (nR === -1 && pR === 1) {
      xUp = nL === pL ? width * -0.05 : width * -0.1;
    } else {
      xUp = width * -0.05 * nL;
    }
  }
  // console.log("xUp: ", xUp);
  return xUp;
};

const findYUp = (nowShape, preShape, width) => {
  const sum = nowShape.topTab + nowShape.bottomTab + preShape.topTab + preShape.bottomTab;

  let yUp = 0;

  if (sum === 1 || sum === -2) {
    yUp = width * -0.05;
  } else if (sum === 2) {
    yUp = width * 0.05;
  } else if (sum === -1) {
    yUp = width * -0.1;
  }

  return yUp;
};

const findYChange = (nowShape, preShape, width) => {
  const nT = nowShape.topTab;
  const nB = nowShape.bottomTab;
  const pT = preShape.topTab;
  const pB = preShape.bottomTab;

  const sum = nT + nB + pT + pB;
  let yChange = 0;

  if (nT === pT && nB === pB) {
    yChange = 0;
  } else if (nT === nB && pT === pB) {
    yChange = 0;
  } else {
    if (nT === 0) {
      yChange = 0.05 * width * nB;
    } else if (nB === 0) {
      yChange = 0.05 * width * pT;
    } else if (pT === nB) {
      yChange = 0.05 * width * pT;
    } else {
      if (Math.abs(sum) === 1) {
        yChange = sum * width * -0.05;
      } else {
        yChange = (sum * width * -0.05) / 2;
      }
    }
  }
  return yChange;
};

const findXChange = (nowShape, preShape, width) => {
  const sum = nowShape.leftTab + nowShape.rightTab + preShape.leftTab + preShape.rightTab;

  let xChange = width * -0.05;
  // console.log(sum);

  if (sum === -1) {
    xChange = width * -0.1;
  } else if (sum === -2) {
    xChange = width * -0.7;
  } else if (sum === 0) {
    xChange = 0;
  } else if (sum === 2) {
    xChange = width * -0.05;
  }

  return xChange;
};

const FindChange = { findXUp, findYUp, findXChange, findYChange };
export default FindChange;
