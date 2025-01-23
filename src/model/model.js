import {useState, useEffect} from 'react'

import ziData from '../data/zi.json'
import ciData from '../data/ci.json'
import hskData from '../data/hsk.json'


// react state to be stored in here
let $ = undefined;

// these will store a time series of all user inputs to derive the state
const keystrokes = [];
const ciQuestion = [];

export function init() {
  const [hskLevel, setHskLevel] = useState(1);
  const [characterSet, setCharacterSet] = useState("simplified");
  const [inputMethod, setInputMethod] = useState("pinyin");
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState([]);
  useEffect(() => {
    // this is a lot of boilerplate but allows us to keep track of state automatically
    $ = {
      hskLevel, characterSet, inputMethod, question, answer,
      setHskLevel: x => { $.hskLevel = x; setHskLevel(x); },
      setCharacterSet: x => { $.characterSet = x; setCharacterSet(x); },
      setInputMethod: x => { $.inputMethod = x; setInputMethod(x); },
      setQuestion: x => { $.question = x; setQuestion(x); },
      setAnswer: x => { $.answer = x; setAnswer(x); },
    }
    randomiseCi();
  }, []);
  return {hskLevel, characterSet, inputMethod, question, answer};
}

export function setHskLevel(level) {
  $.setHskLevel(level);
  randomiseCi();
  // TODO: need to reset answer
}
export function setCharacterSet(characterSet) {
  $.setCharacterSet(characterSet);
  deriveQuestionFromCi();
  // TODO: need to reset answer only if input method is wubi or cangjie
}
export function setInputMethod(inputMethod) {
  $.setInputMethod(inputMethod);
  deriveQuestionFromCi();
  // TODO: need to reset answer
}

export function pushKeystroke(timestamp, keycode) {
  keystrokes.push([timestamp, keycode]);
  // TODO: calculate if answer matches input
}

function randomiseCi(numWords=10) {
  const randomised = Array(numWords).fill(undefined).map(_ => {
    const options = hsk[$.hskLevel];
    return options[Math.floor(options.length * Math.random())];
  });
  ciQuestion.push(randomised);
  deriveQuestionFromCi();
}
function deriveQuestionFromCi() {
  $.setQuestion(
    ciQuestion[ciQuestion.length - 1].map(({simplified, traditional, pinyin}) => {
      const ciSingle = ci[simplified][traditional][pinyin];
      const result = {
        characters: ciSingle[$.characterSet],
        meanings: ciSingle.meanings,
      };

      if (["wubi", "cangjie"].includes($.inputMethod)) {
        result.pronounciation = accentPinyin(pinyin);
        result.spelling = result.characters.split("").map(
          x => { return zi[x][$.inputMethod].split(" ")}
        );
      } else if ($.inputMethod === "pinyin") {
        result.pronounciation = accentPinyin(pinyin);
        result.spelling = pinyin.split(" ").map(
          x => [x.slice(0, -1)]
        );
      } else {
        result.pronounciation = accentJyutping(ciSingle.jyutping);
        result.spelling = ciSingle.jyutping.split(" ").map(
          x => [x.slice(0, -1)]
        );
      }
      return result;
    })
  );
}

function accentPinyin(pinyin) {
  return pinyin.split(" ").map(accentPinyinSingle).join(" ");
}

function accentPinyinSingle(pinyin) {
  const tone = Number(pinyin[pinyin.length - 1]);
  const vowelStartIdx = pinyin.split("").findIndex(x => "aAeEiIoOuUvV".includes(x));
  const vowelEndIdx = pinyin.split("").findLastIndex(x => "aAeEiIoOuUvV".includes(x));

  const vowelAccentIdx = "iuv".includes(pinyin[vowelStartIdx])
    ? Math.min(vowelStartIdx + 1, vowelEndIdx)
    : vowelStartIdx;
  const vowelAccent = pinyin[vowelAccentIdx];

  const correctedAccent = {
    a: ["ā", "á", "ǎ", "à", "a"],
    A: ["Ā", "Á", "Ǎ", "À", "A"],
    e: ["ē", "é", "ě", "è", "e"],
    E: ["Ē", "É", "Ě", "È", "E"],
    i: ["ī", "í", "ǐ", "ì", "i"],
    I: ["Ī", "Í", "Ǐ", "Ì", "I"],
    o: ["ō", "ó", "ǒ", "ò", "o"],
    O: ["Ō", "Ó", "Ǒ", "Ò", "o"],
    u: ["ū", "ú", "ǔ", "ù", "u"],
    U: ["Ū", "Ú", "Ǔ", "Ù", "u"],
    v: ["ǖ", "ǘ", "ǚ", "ǜ", "ü"],
    V: ["Ǖ", "Ǘ", "Ǚ", "Ǜ", "Ü"],
  }[vowelAccent][tone - 1]

  return `${pinyin.substring(0, vowelStartIdx)}${pinyin.substring(vowelStartIdx, vowelAccentIdx)}${correctedAccent}${pinyin.substring(vowelAccentIdx+1, pinyin.length-1)}`;
}

function accentJyutping(jyutping) {
  return jyutping.split(" ").map(accentJyutpingSingle).join(" ");
}

function accentJyutpingSingle(jyutping) {
  // TODO: show better accents than numbers
  // but the instagram curves are a bit better
  const tone = Number(jyutping[jyutping.length - 1]);
  const contour = ["˥", "˧˥", "˧", "˨˩", "˩˧", "˨"][tone - 1];
  return `${jyutping.substring(0, jyutping.length-1)}${contour}`;
}

function* iterrows(table) {
  const keys = Object.keys(table);
  for (let i=0; i<table[keys[0]].length; i++) {
    yield keys.reduce((acc, key) => { acc[key] = table[key][i];
      return acc;
    }, {});
  }
}

const zi = iterrows(ziData).reduce((acc, row) => {
  acc[row["hanzi"]] = row;
  return acc;
}, {});

const ci = iterrows(ciData).reduce((acc, row) => {
  // use simplified as key because that is the format of HSK
  if (!(row["simplified"] in acc)) {
    acc[row["simplified"]] = {};
  }
  if (!(row["traditional"] in acc[row["simplified"]])) {
    acc[row["simplified"]][row["traditional"]] = {};
  }
  acc[row["simplified"]][row["traditional"]][row["pinyin"]] = row;
  return acc;
}, {});

const hsk = iterrows(hskData).reduce((acc, row) => {
  if (!(row["level"] in acc)) {
    acc[row["level"]] = [];
  }
  acc[row["level"]].push(row);
  return acc;
}, {});
