import { useState } from 'react';
import './App.css'
import zi from '../public/zi.json'
import ci from '../public/ci.json'

const chars = zi.reduce(
  (acc, item) => {
    acc[item["hanzi"]] = {
      wubi: item["wubi"].split(" "),
      cangjie: item["cangjie"].split(" ")
    };
    return acc;
  },
  {},
);
// const wubis = characters.reduce(
//   (acc, item) => {
//     for (const wubi of item["wubi"].split(" ")) {
//       if (wubi in acc) {
//         acc[wubi].push(item["character"]);
//       } else {
//         acc[wubi] = [item["character"]];
//       }
//     }
//     return acc;
//   },
//   {},
// );

function randomCi() {
  return ci[Math.floor(ci.length * Math.random())];
}

function App() {
  const [user, setUser] = useState("");
  const [rand, setRand] = useState(randomCi());
  // const [rand, setRand] = useState("一");
  const [correct, setCorrect] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
      // <h1 style={(wubis[user] ?? []).includes(rand) ? {color: "Chartreuse"} : {}}>{wubis[user]}</h1>
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
          setRand(randomCi());
        } else {
          setUser(newVal);
        }
      }
      } />
      <h2 style={{color: "Chartreuse"}}>{correct}</h2>
      <h2 style={{color: "red"}}>{incorrect}</h2>
      <h3>手 田 水 口 廿 卜 山 戈 人 心</h3>
      <h3>日 尸 木 火 土 竹 十 大 中</h3>
      <h3>重 難 金 女 月 弓 一</h3>
      <br/>
      <h3>金 人 月 白 禾 言 立 水 火 之</h3>
      <h3>工 木 大 土 王 目 日 口 田</h3>
      <h3>纟 又 女 子 已 山</h3>
    </>
  )
}

export default App
