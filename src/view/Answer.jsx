export default function Answer({ correct, incorrect }) {
  return (
    <>
      <p className="answer-correct">{correct.join("").replaceAll(" ", "•")}</p>
      <p className="answer-incorrect">{incorrect.join("").replaceAll(" ", "•")}</p>
    </>
  )
}