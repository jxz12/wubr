import { useState } from 'react';
import './App.css'
import hanzis from './hanzis.json'

letter,section,representativeRoot,roots
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
