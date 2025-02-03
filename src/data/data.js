import ziData from '../data/zi.json'
import ciData from '../data/ci.json'
import hskData from '../data/hsk.json'


function* iterrows(table) {
  const keys = Object.keys(table);
  for (let i=0; i<table[keys[0]].length; i++) {
    yield keys.reduce((acc, key) => { acc[key] = table[key][i];
      return acc;
    }, {});
  }
}

function iterreduce(table, reducer) {
  // need Array.from because vitest fails with "TypeError: iterrows(...).reduce is not a function"
  return Array.from(iterrows(table)).reduce(reducer);
}

export const zi = iterreduce(ziData, (acc, row) => {
  acc[row["hanzi"]] = row;
  return acc;
}, {});

export const ci = iterreduce(ciData, (acc, row) => {
  // 3-tuple of simplified+traditional+pinyin is a unique primary key
  // TODO: this might be better if transformed into a single string key
  if (!(row["simplified"] in acc)) {
    acc[row["simplified"]] = {};
  }
  if (!(row["traditional"] in acc[row["simplified"]])) {
    acc[row["simplified"]][row["traditional"]] = {};
  }
  if (row["pinyin"] in acc[row["simplified"]][row["traditional"]]) {
    throw Error("primary key is not unique");
  }
  acc[row["simplified"]][row["traditional"]][row["pinyin"]] = row;
  return acc;
}, {});

export const hsk = iterreduce(hskData, (acc, row) => {
  if (!(row["level"] in acc)) {
    acc[row["level"]] = [];
  }
  acc[row["level"]].push(row);
  return acc;
}, {});