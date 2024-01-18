let config;
let gIndex;

// puzzle 객체 config setting
const setting = (conf) => {
  config = { ...conf };
  if (!isNaN(gIndex)) {
    config.groupTileIndex = gIndex;
  }
};

// puzzle 객체의 특정 값 변경
const settingValue = (key, value) => {
  config[key] = value;
};

// puzzle 객체 config export
const exportConfig = () => config;

const Puzzle = {
  setting,
  settingValue,
  exportConfig,
};
export default Puzzle;
