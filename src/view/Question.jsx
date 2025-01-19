export default function Question({ question, answer, characterSet, inputMethod }) {
  return (
    <div className="question">
      {question.map((word, i) => (
        <Word
          key={i}
          characters={word[characterSet]}
          spelling={word[inputMethod]}
          meanings={word.meanings}
        />
      ))}
    </div>
  );
}

function Word({ characters, spelling, meanings }) {
  const charArray = characters.split("");
  const spellArray = spelling.split(" ");
  if (charArray.length !== spellArray.length) {
    throw Error("length of characters does not equal length of spelling");
  }
  // TODO: on hover show meaning(s)
  console.log(characters, meanings);
  return (
    <span className="ci">
      {charArray.map((_, i) => (
        <span key={i} className="zi">
          <div className="spelling">{accentPinyin(spellArray[i])}</div>
          <div className="character">{charArray[i]}</div>
        </span>
      ))}
    </span>
  );
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