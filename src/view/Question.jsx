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

  const characters = ci.characters.split("");
  const pronounciations = ci.pronounciation[0].pinyin.split(" ");
  if (characters.length !== pronounciations.length) {
    throw Error("length of characters does not equal length of spelling");
  }
  return (
    <span className="ci">
      {characters.map((_, i) => <Zi key={i} character={characters[i]} pronounciation={pronounciations[i]} />)}
    </span>
  );
}

function Zi({ character, pronounciation }) {
  return (
    <span className="zi">
      <div className="pronounciation">{pronounciation}</div>
      <div className="character">{character}</div>
    </span>
  )
}