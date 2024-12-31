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
  return keys[Math.floor(keys.length * Math.random())];
}

// letter,section,representativeRoot,roots
function App() {
  let [user, setUser] = useState("");
  let [rand, setRand] = useState(randWubi());
  return (
    <>
      <h1>{wubi2chars[rand]}</h1>
      <input value={user} onChange={(e) => {
        const newVal = e.target.value;
        if (newVal.slice(-1) == " ") {
          setUser("");
          setRand(randWubi());
        } else {
          setUser(newVal);
        }
      }
      } />
      <h1 style={user == rand ? {color: "Chartreuse"} : {}}>{wubi2chars[user]}</h1>
    </>
  )
}

export default App
