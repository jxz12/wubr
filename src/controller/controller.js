import {click, answer} from '../model/model'

document.addEventListener('keydown', pushKeystroke, true);

const clicks = [];
export function pushClick(event) {
  clicks.push(event);
  click(event.target.name, event.target.value);
}

const keystrokes = [];
function pushKeystroke(event) {
  console.log(event.code);
  console.log(event.timeStamp);
  keystrokes.push(event);
  answer(keystrokes.map(e => e.code));
}
