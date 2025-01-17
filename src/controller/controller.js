import {
  setHskLevel,
  setCharacterSet,
  setInputMethod,
  pushKeystroke
} from '../model/model'


// NOTE to self: the controller needs to be stateless
//   this will therefore be quite a thin layer just to convert between HTML events and our model

export function select(event) {
  switch (event.target.name) {
    case "hskLevel":
      setHskLevel(event.target.value);
    case "characterSet":
      setCharacterSet(event.target.value);
    case "inputMethod":
      setInputMethod(event.target.value);
  }
}

document.addEventListener('keydown', onKeyDown, true);
function onKeyDown(event) {
  pushKeystroke(event.timeStamp, event.code);
}
