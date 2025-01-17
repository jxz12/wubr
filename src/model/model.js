import {useState, useEffect} from 'react'

import zi from '../data/zi.json'
import ci from '../data/ci.json'
import hsk from '../data/hsk.json'


// global state representing the model
const state = {
  hskLevel: 1,
  characterSet: "simplified",
  inputMethod: "pinyin",

  // these will store a time series of all user inputs to derive the state
  keystrokes: [],
};

const set = {};

export function init() {
  const [hskLevel, setHskLevel] = useState(state.hskLevel);
  const [characterSet, setCharacterSet] = useState(state.characterSet);
  const [inputMethod, setInputMethod] = useState(state.inputMethod);
  const [quiz, setQuiz] = useState([]);
  const [answer, setAnswer] = useState([]);
  useEffect(() => {
    set.hskLevel = setHskLevel;
    set.characterSet = setCharacterSet;
    set.inputMethod = setInputMethod;
    set.quiz = setQuiz;
    set.answer = setAnswer;
    newQuiz();
  }, []);
  return {hskLevel, characterSet, inputMethod, quiz, answer};
}

export function setHskLevel(level) {
  state.hskLevel = level;
  set.hskLevel(level);
  // TODO: need to reset entire quiz, questions and answers
}
export function setCharacterSet(characterSet) {
  state.characterSet = characterSet;
  set.characterSet(characterSet);
}
export function setInputMethod(inputMethod) {
  state.inputMethod = inputMethod;
  set.inputMethod(inputMethod);
  // TODO: reset the answer
}
export function pushKeystroke(timestamp, keycode) {
  console.log(timestamp, keycode);
  state.keystrokes.push([timestamp, keycode]);
  // TODO: calculate if answer matches input
}

function newQuiz() {
  set.quiz(randomWords(state.hskLevel));
}

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