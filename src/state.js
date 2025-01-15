import {useState, useEffect} from 'react'

import zi from './data/zi.json'
import ci from './data/ci.json'
import hsk from './data/hsk.json'

const keystrokes = [];
const clicks = [];
function pushKeystroke(event) {
  keystrokes.push(event);
  evaluate();
}
export function pushClick(event) {
  clicks.push(event),
  evaluate();
}

// this needs to be private since only this module should determine output state
const outputs = {};

export function init() {
  const [characterSet, setCharacterSet] = useState("simplified");
  const [inputMethod, setInputMethod] = useState("pinyin");
  const [hskLevel, setHskLevel] = useState(1);
  useEffect(() => {
    outputs.setCharacterSet = setCharacterSet;
    outputs.setInputMethod = setInputMethod;
    outputs.setHskLevel = setHskLevel;
    document.addEventListener('keydown', pushKeystroke, true);
  }, []);
  return {characterSet, inputMethod, hskLevel};
}

function evaluate() {
  console.log(keystrokes);
  console.log(clicks);
}

function* iterrows(table) {
  const keys = Object.keys(table);
  for (let i=0; i<table[keys[0]].length; i++) {
    yield keys.reduce((acc, key) => {
      acc[key] = table[key][i];
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

function randomWords(level, numWords=10) {
  return words[Math.floor(words.length * Math.random())];
}