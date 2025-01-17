import {useState, useEffect} from 'react'

import {randomWords} from './words'


// global state
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
    document.addEventListener('keydown', pushKeystroke, true);
    newQuiz();
  }, []);
  return {hskLevel, characterSet, inputMethod, quiz, answer};
}

const clicks = [];
export function pushClick(event) {
  console.log(event.target.name);
  console.log(event.timeStamp);
  clicks.push(event);
  const key = event.target.name;
  state[key] = event.target.value;
  set[key](state[key]);
}

const keystrokes = [];
function pushKeystroke(event) {
  console.log(event.code);
  console.log(event.timeStamp);
  keystrokes.push(event);
  set.answer(keystrokes.map(e => e.code));
}

function newQuiz() {
  set.quiz(randomWords(state.hskLevel));
}
