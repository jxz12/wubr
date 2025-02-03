import {useState, useEffect} from 'react'

import {
  initModel,
  randomiseCi,
  setHskLevel,
  setCharacterSet,
  setInputMethod,
  pushKeystroke,
} from '../model/model'


// NOTE to self: the controller should be stateless
//   and the purpose is to be a thin layer to abstract React and HTML away from the model

export function initController() {
  const [hskLevel, setHskLevel] = useState(undefined);
  const [characterSet, setCharacterSet] = useState(undefined);
  const [inputMethod, setInputMethod] = useState(undefined);
  const [question, setQuestion] = useState(undefined);
  const [correct, setCorrect] = useState(undefined);
  const [incorrect, setIncorrect] = useState(undefined);
  useEffect(() => {
    // you could imagine this init function taking time
    initModel(setHskLevel, setCharacterSet, setInputMethod, setQuestion, setCorrect, setIncorrect);
  }, []);
  return {hskLevel, characterSet, inputMethod, question, correct, incorrect};
}

export function select(event) {
  switch (event.target.name) {
    case "hskLevel":
      setHskLevel(event.target.value);
      break;
    case "characterSet":
      setCharacterSet(event.target.value);
      break;
    case "inputMethod":
      setInputMethod(event.target.value);
      break;
  }
}

document.addEventListener('keydown', onKeyDown, true);
function onKeyDown(event) {
  pushKeystroke(event.code, event.timeStamp);
}
