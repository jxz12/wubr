import { useState } from 'react';
import './App.css'
import characters from '../public/characters.json'

const chars = characters.reduce(
  (acc, item) => {
    acc[item["character"]] = {
      wubi: item["wubi"].split(" "),
      pinyin: item["pinyin"].split(" ")
    };
    return acc;
  },
  {},
);
const wubis = characters.reduce(
  (acc, item) => {
    for (const wubi of item["wubi"].split(" ")) {
      acc[wubi] = item["character"];
    }
    return acc;
  },
  {},
)

function randChar() {
  const keys = Object.keys(chars);
  return keys[Math.floor(keys.length * Math.random())];
}

function App() {
  const [user, setUser] = useState("");
  const [rand, setRand] = useState(randChar());
  // const [rand, setRand] = useState("一");
  const [correct, setCorrect] = useState([]);
  return (
    <>
      <h2>{chars[rand].pinyin[0]}</h2>
      <h1>{rand}</h1>
      <input value={user} onChange={e => {
        const newVal = e.target.value;
        if (newVal.slice(-1) == " ") {
          if (wubis[user] == rand) {
            setCorrect(prev => prev.concat([rand]))
          }
          setUser("");
          setRand(randChar());
        } else {
          setUser(newVal);
        }
      }
      } />
      <h1 style={wubis[user] == rand ? {color: "Chartreuse"} : {}}>{wubis[user]}</h1>
      <h2 style={{color: "Chartreuse"}}>{correct}</h2>
    </>
  )
}

export default App
