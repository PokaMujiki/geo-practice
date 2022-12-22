export const partition = (arr, filterFunc) => {
  let pass = [];
  let fail = [];

  arr.forEach((item) => (filterFunc(item) ? pass.push(item) : fail.push(item)));

  return { pass, fail };
};
