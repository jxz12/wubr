import { useState } from 'react';
import './App.css'
import hanzis from './hanzis.json'

const char2wubi = {};
const wubi2char = {};
for (let mapping of hanzis) {
  char2wubi[mapping.character] = mapping.wubiCode;
  wubi2char[mapping.wubiCode] = mapping.character;
}

function App() {
  let [wubi, setWubi] = useState("");
  console.log(wubi);
  return (
    <>
      <input onChange={e => setWubi(e.target.value)}/>
      <h1>{wubi2char[wubi]}</h1>
    </>
  )
}

export default App
