export default function Answer({ correct, incorrect }) {
  return (
    <>
      <span className="answer-correct">{correct.join("").replaceAll(" ", "•")}</span>
      <span className="answer-incorrect">{incorrect.join("").replaceAll(" ", "•")}</span>
    </>
  )
}