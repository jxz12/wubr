export default function Question({ question, answer, characterSet, inputMethod }) {
  return (
    <div className="question">
      {question.map((word, i) => (
        <Word
          key={i}
          characters={word[characterSet]}
          spelling={word[inputMethod]}
          meaning={word.meanings}
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
          <div className="spelling">{spellArray[i]}</div>
          <div className="character">{charArray[i]}</div>
        </span>
      ))}
    </span>
  );
}