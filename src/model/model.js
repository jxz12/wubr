import {useState, useEffect} from 'react'

import zi from '../data/zi.json'
import ci from '../data/ci.json'
import hsk from '../data/hsk.json'


// react state to be stored in here
let $ = undefined;

// these will store a time series of all user inputs to derive the state
const keystrokes = [];

export function init() {
  const [hskLevel, setHskLevel] = useState(1);
  const [characterSet, setCharacterSet] = useState("simplified");
  const [inputMethod, setInputMethod] = useState("pinyin");
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState([]);
  useEffect(() => {
    // this is a lot of boilerplate but allows us to keep track of state automatically
    $ = {
      hskLevel, characterSet, inputMethod, question, answer,
      setHskLevel: x => { $.hskLevel = x; setHskLevel(x); },
      setCharacterSet: x => { $.characterSet = x; setCharacterSet(x); },
      setInputMethod: x => { $.inputMethod = x; setInputMethod(x); },
      setQuestion: x => { $.question = x; setQuestion(x); },
      setAnswer: x => { $.answer = x; setAnswer(x); },
    }
    newQuestion();
  }, []);
  return {hskLevel, characterSet, inputMethod, question, answer};
}

export function setHskLevel(level) {
  $.setHskLevel(level);
  // TODO: need to reset entire question, questions and answers
}
export function setCharacterSet(characterSet) {
  $.setCharacterSet(characterSet);
}
export function setInputMethod(inputMethod) {
  $.setInputMethod(inputMethod);
  // TODO: reset the answer
}

export function pushKeystroke(timestamp, keycode) {
  keystrokes.push([timestamp, keycode]);
  // TODO: calculate if answer matches input
}

function newQuestion() {
  $.setQuestion(randomWords($.hskLevel));
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