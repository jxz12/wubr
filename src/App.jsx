import './App.css'

import { init } from "./model/model";
import NavBar from './view/NavBar';
import Question from './view/Question'
import Keyboard from './view/Keyboard'


export default function App() {
  // TODO: pronounce words as you type
  const { hskLevel, characterSet, inputMethod, question, answer } = init();
  return (
    <>
      <NavBar hskLevel={hskLevel} characterSet={characterSet} inputMethod={inputMethod} />
      <Question question={question} />
      <Keyboard inputMethod={inputMethod} answer={answer} />
    </>
  )
}
