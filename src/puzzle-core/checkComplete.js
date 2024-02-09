export const checkComplete = ({ config }) => {
  let flag = false;
  if (config !== undefined) {
    const firstGroup = config.groupTiles[0][1];

    if (firstGroup !== undefined) {
      flag = true;
      config.groupTiles.forEach((gtile) => {
        const nowGroup = gtile[1];
        if (nowGroup !== firstGroup) {
          flag = false;
        }
      });
    }
  }
  if (flag && !config.complete) {
    config.complete = true;
  } else {
    flag = false;
  }
  return flag;
};
