import {useState, useEffect} from 'react'

import ziData from '../data/zi.json'
import ciData from '../data/ci.json'
import hskData from '../data/hsk.json'


// react state to be stored in here
let $ = undefined;

// these will store a time series of all user inputs to derive the state
const keystrokes = [];
const ciQuestion = [];

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
    randomiseCi();
  }, []);
  return {hskLevel, characterSet, inputMethod, question, answer};
}

export function setHskLevel(level) {
  $.setHskLevel(level);
  randomiseCi();
  // TODO: need to reset answer
}
export function setCharacterSet(characterSet) {
  $.setCharacterSet(characterSet);
  deriveQuestionFromCi();
  // TODO: need to reset answer only if input method is wubi or cangjie
}
export function setInputMethod(inputMethod) {
  $.setInputMethod(inputMethod);
  deriveQuestionFromCi();
  // TODO: need to reset answer
}

export function pushKeystroke(timestamp, keycode) {
  keystrokes.push([timestamp, keycode]);
  // TODO: calculate if answer matches input
}

function randomiseCi(numWords=10) {
  const randomised = Array(numWords).fill(undefined).map(_ => {
    const options = hsk[$.hskLevel];
    return options[Math.floor(options.length * Math.random())];
  });
  ciQuestion.push(randomised);
  deriveQuestionFromCi();
}
function deriveQuestionFromCi() {
  $.setQuestion(
    ciQuestion[ciQuestion.length - 1].map(simplified => {
      const result = { simplified };
      result.definitions = ci[simplified];

      if (["wubi", "cangjie"].includes($.inputMethod)) {
        // TODO: handle when characterSet is traditional?
        result.spelling = simplified.map(
          x => x.split("").map(
            x => zi[x][$.inputMethod].split(" ")  // multiple wubi/cangjie can map to one character
          )
        );
      } else {
        result.spelling = simplified.split("").map(
          (_, i) => ci[simplified].map(
            x => x[$.inputMethod].split(" ")[i].slice(0, -1)  // remove tone number at end
          )
        );
      }
      return result;
    })
  );
}

function* iterrows(table) {
  const keys = Object.keys(table);
  for (let i=0; i<table[keys[0]].length; i++) {
    yield keys.reduce((acc, key) => { acc[key] = table[key][i];
      return acc;
    }, {});
  }
}

const zi = iterrows(ziData).reduce((acc, row) => {
  acc[row["hanzi"]] = row;
  return acc;
}, {});

const ci = iterrows(ciData).reduce((acc, row) => {
  // use simplified as key because that is the format of HSK
  if (!(row["simplified"] in acc)) {
    acc[row["simplified"]] = [];
  }
  acc[row["simplified"]].push(row);
  return acc;
}, {});

const hsk = iterrows(hskData).reduce((acc, row) => {
  if (!(row["level"] in acc)) {
    acc[row["level"]] = [];
  }
  acc[row["level"]].push(row["simplified"]);
  return acc;
}, {});
