import {useState, useEffect} from 'react'

import zi from '../data/zi.json'
import ci from '../data/ci.json'
import hsk from '../data/hsk.json'


// global state representing the model
const state = {
  hskLevel: 1,
  characterSet: "simplified",
  inputMethod: "pinyin",
  quiz: [],
  answer: [],
};

const set = {};

export function init() {
  const [hskLevel, setHskLevel] = useState(state.hskLevel);
  const [characterSet, setCharacterSet] = useState(state.characterSet);
  const [inputMethod, setInputMethod] = useState(state.inputMethod);
  const [quiz, setQuiz] = useState(state.quiz);
  const [answer, setAnswer] = useState(state.answer);
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

export function click(name, value) {
  state[name] = value;
  set[name](state[name]);
}
export function answer(codes) {
  state.answer = codes;
  set.answer(state.answer);
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