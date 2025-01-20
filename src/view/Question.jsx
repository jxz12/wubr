export default function Question({ question }) {
  return (
    <div className="question">
      {question.map((ci, i) => <Ci key={i} ci={ci} />)}
    </div>
  );
}

function Ci({ ci }) {
  // TODO: on hover show meaning(s)
  console.log(ci);

  const characters = ci.simplified.split("");
  // TODO: handle multiple pronounciations or jyutping
  const pinyins = ci.definitions[0].pinyin.split(" ");
  if (characters.length !== pinyins.length) {
    throw Error("length of characters does not equal length of spelling");
  }
  return (
    <span className="ci">
      {characters.map((_, i) => <Zi key={i} character={characters[i]} pinyin={accentPinyin(pinyins[i])} />)}
    </span>
  );
}

function Zi({ character, pinyin, jyutping }) {
  // TODO: show jyutping
  return (
    <span className="zi">
      <div className="pinyin">{pinyin}</div>
      <div className="character">{character}</div>
    </span>
  )
}

function accentPinyin(pinyin) {
  const tone = Number(pinyin[pinyin.length - 1]);
  const vowelStartIdx = pinyin.split("").findIndex(x => "aeiouv".includes(x));
  const vowelEndIdx = pinyin.split("").findLastIndex(x => "aeiouv".includes(x));

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