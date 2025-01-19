export default function Question({question, answer, characterSet, inputMethod}) {
  return question.map(
    (word, i) => <Word key={i} characters={word[characterSet]} inputs={word[inputMethod]}/>
  );
}

function Word({characters, spelling}) {
  return (
    <span>
      <div>{characters}</div>
      <div>{spelling}</div>
    </span>
  );
  // TODO: on hover show meaning(s)
  // return characters.map(character =>
  //   <span>
  //     <div></div>
  //     <div></div>
  //   </span>
  // );
}