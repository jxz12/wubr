import './App.css'

import {init} from "./state";
import NavBar from './components/NavBar';


export default function App() {
  // TODO: pronounce words as you type
  const {hskLevel, characterSet, inputMethod} = init();
  return (
    <>
      <header>
        <NavBar hskLevel={hskLevel} characterSet={characterSet} inputMethod={inputMethod} />
      </header>
      <body>
        <Text problem={["foo", "bar"]}/>
        <Keyboard inputMethod={inputMethod}/>
      </body>
      <footer>
        <Footer/>
      </footer>
    </>
  )
}
