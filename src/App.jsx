import './App.css'

import { init } from "./model/model"
import NavBar from './view/NavBar'
import Question from './view/Question'
import Answer from './view/Answer'
import Keyboard from './view/Keyboard'


export default function App() {
  // TODO: pronounce words as you type
  const { hskLevel, characterSet, inputMethod, question, correct, incorrect } = init();
  return (
    <>
      <NavBar hskLevel={hskLevel} characterSet={characterSet} inputMethod={inputMethod} />
      <Question question={question} />
      <Answer correct={correct} incorrect={incorrect} />
      <Keyboard inputMethod={inputMethod} />
    </>
  )
}
