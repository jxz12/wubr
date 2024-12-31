import { useState } from 'react';
import './App.css'
import wubi from '../public/wubi.json'

const wubi2chars = wubi.reduce(
  (acc, item) => {
    if (item["wubi"] in acc) {
      acc[item["wubi"]].push(item["character"]);
    } else {
      acc[item["wubi"]] = [item["character"]];
    }
    return acc;
  },
  {},
);

function randWubi() {
  const keys = Object.keys(wubi2chars);
  return wubi2chars[keys[Math.floor(keys.length * Math.random())]];
}

// letter,section,representativeRoot,roots
function App() {
  let [wubi, setWubi] = useState("");
  let [rand, setRand] = useState(randWubi());
  return (
    <>
      <div>
        <h1>{rand}</h1>
        <button onClick={() => setRand(randWubi())}>randomize</button>
      </div>
      <div>
        <input onChange={e => setWubi(e.target.value)}/>
        <h1>{wubi2chars[wubi]}</h1>
      </div>
    </>
  )
}

export default App
