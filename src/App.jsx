import './App.css'

import {init} from "./model/model";
import NavBar from './view/NavBar';
import Quiz from './view/Quiz'


export default function App() {
  // TODO: pronounce words as you type
  const {hskLevel, characterSet, inputMethod, quiz} = init();
  return (
    <>
      <NavBar hskLevel={hskLevel} characterSet={characterSet} inputMethod={inputMethod} />
      <Quiz words={quiz} characterSet={characterSet}/>
      {/* <Keyboard inputMethod={inputMethod}/> */}
    </>
  )
}
