import {useState, useEffect} from 'react'

import {zi, ci, hsk} from '../data/data'


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
  const [correct, setCorrect] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  useEffect(() => {
    // this is a lot of boilerplate but allows us to keep track of state automatically
    $ = {
      hskLevel, characterSet, inputMethod, question, correct, incorrect,
      setHskLevel: x => { $.hskLevel = x; setHskLevel(x); },
      setCharacterSet: x => { $.characterSet = x; setCharacterSet(x); },
      setInputMethod: x => { $.inputMethod = x; setInputMethod(x); },
      setQuestion: x => { $.question = x; setQuestion(x); },
      setCorrect: x => { $.correct = x; setCorrect(x); },
      setIncorrect: x => { $.incorrect = x; setIncorrect(x); },
    }
    randomiseCi();
  }, []);
  return {hskLevel, characterSet, inputMethod, question, correct, incorrect};
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

function randomiseCi(numWords=10) {
  const randomised = Array(numWords).fill(undefined).map(_ => {
    const options = hsk[$.hskLevel];
    return options[Math.floor(options.length * Math.random())];
  });
  ciQuestion.push(randomised);
  keystrokes.push([]);
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
  // TODO: this sort of rendering would be nicer https://visual-fonts.com/2024/04/make-jyutping-look-good/
  const tone = Number(jyutping[jyutping.length - 1]);
  const contour = ["˥", "˧˥", "˧", "˨˩", "˩˧", "˨"][tone - 1];
  return `${jyutping.substring(0, jyutping.length-1)}${contour}`;
}

export function pushKeystroke(keycode, timestamp) {
  const currentKeystrokes = keystrokes[keystrokes.length - 1]
  currentKeystrokes.push({keycode, timestamp});
  const { correct, incorrect } = markAnswer(
    $.question.map(ci => ci.spelling),
    currentKeystrokes.map(ks => ks.keycode),
  );
  $.setCorrect(correct);
  $.setIncorrect(incorrect);
}

export function markAnswer(spellings, keycodes) {
  const letters = keycodes.reduce((agg, keycode) => {
    if (keycode === "Backspace") {
      agg.pop();
    } else if (keycode.startsWith("Key")) {
      agg.push(keycode[3].toLowerCase());
    } else if (keycode === "Space") {
      agg.push(" ");
    }
    return agg;
  }, [])

  const correct = [];
  const incorrect = [];
  let ciIndex = 0;
  let ziIndex = 0;
  for (const letter of letters) {
    if (incorrect.length > 0) {
      incorrect.push(letter);
      continue;
    }
    if (ziIndex > spellings[ciIndex].length) {
      if (letter === " ") {
        correct.push(letter);
        ciIndex += 1;
        ziIndex = 0;
      } else {
        incorrect.push(letter);
      }
      continue;
    }
    if (spellings[ciIndex][ziIndex].includes(letter)) {
      correct.push(letter);
      ziIndex += 1;
      continue;
    }
    incorrect.push(letter);
  }
  return {correct, incorrect};
}
