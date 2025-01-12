import { useState } from 'react';
import './App.css'
import zi from './data/zi.json'
import ci from './data/ci.json'
import hsk from './data/hsk.json'

function* iterrows(table) {
  const keys = Object.keys(table);
  for (let i=0; i<table[keys[0]].length; i++) {
    yield keys.reduce((acc, key) => {
      acc[key] = table[key][i];
      return acc;
    }, {});
  }
}

const chars = iterrows(zi).reduce((acc, row) => {
  acc[row["hanzi"]] = {
    wubi: row["wubi"]?.split(" "),
    cangjie: row["cangjie"]?.split(" ")
  };
  return acc;
}, {});

const words = Array.from(iterrows(ci).map(row => row))

const levels = iterrows(hsk).reduce((acc, row) => {
  if (!(row["level"] in acc)) {
    acc[row["level"]] = [];
  }
  // TODO: push the words instead
  acc[row["level"]].push(row["simplified"]);
  return acc;
}, {});

function randomWord() {
  return words[Math.floor(words.length * Math.random())];
}

function App() {
  const [user, setUser] = useState("");
  const [rand, setRand] = useState(randomWord());
  return (
    <>
      <h2>{rand.pinyin}</h2>
      <h1>{rand.simplified}</h1>
      <h2>{rand.jyutping}</h2>
      <h1>{rand.traditional}</h1>
      <h3>{rand.meanings}</h3>
      <input value={user} onChange={e => {
        const newVal = e.target.value;
        if (newVal.slice(-1) == " ") {
          // if ((wubis[user] ?? []).includes(rand)) {
          //   setCorrect(prev => prev.concat([rand]));
          // } else {
          //   setIncorrect(prev => prev.concat([rand, chars[rand].wubi[0]]))
          // }
          setUser("");
          setRand(randomWord());
        } else {
          setUser(newVal);
        }
      }} />
    </>
  )
}

export default App
