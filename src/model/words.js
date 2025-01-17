import zi from '../data/zi.json'
import ci from '../data/ci.json'
import hsk from '../data/hsk.json'


function* iterrows(table) {
  const keys = Object.keys(table);
  for (let i=0; i<table[keys[0]].length; i++) {
    yield keys.reduce((acc, key) => { acc[key] = table[key][i];
      return acc;
    }, {});
  }
}

const chars = iterrows(zi).reduce((acc, row) => {
  acc[row["hanzi"]] = row;
  return acc;
}, {});

const words = iterrows(ci).reduce((acc, row) => {
  // use simplified as key because that is the format of HSK
  acc[row["simplified"]] = row
  return acc;
}, {});

const levels = iterrows(hsk).reduce((acc, row) => {
  if (!(row["level"] in acc)) {
    acc[row["level"]] = [];
  }
  acc[row["level"]].push(row["simplified"]);
  return acc;
}, {});

export function randomWords(level, numWords=10) {
  // TODO: eventually this should be customised based on the user's learning progress, like keybr
  return words[Math.floor(words.length * Math.random())];
}