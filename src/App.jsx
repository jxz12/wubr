import './App.css'

import { initController } from './controller/controller'
import NavBar from './view/NavBar'
import Question from './view/Question'
import Answer from './view/Answer'
import Keyboard from './view/Keyboard'


export default function App() {
  // TODO: pronounce words as you type
  const { hskLevel, characterSet, inputMethod, question, correct, incorrect } = initController();
  if (hskLevel === undefined) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <NavBar hskLevel={hskLevel} characterSet={characterSet} inputMethod={inputMethod} />
        <Question question={question} />
        <Answer correct={correct} incorrect={incorrect} />
        <Keyboard inputMethod={inputMethod} />
      </>
    );
  }
}
