import './App.css'

import {init} from "./state/hub";
import NavBar from './components/NavBar';
import Quiz from './components/Quiz'


export default function App() {
  // TODO: pronounce words as you type
  const {hskLevel, characterSet, inputMethod, quiz} = init();
  return (
    <>
      <NavBar hskLevel={hskLevel} characterSet={characterSet} inputMethod={inputMethod} />
      <Quiz words={quiz}/>
      {/* <Keyboard inputMethod={inputMethod}/> */}
    </>
  )
}
