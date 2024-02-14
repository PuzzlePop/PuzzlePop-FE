export const match = (matcher) => (key) => {
  const value = matcher[key];
  if (value === undefined) {
    throw new Error("matcher value is undefined");
  }
  return matcher[key];
};
