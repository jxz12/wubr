import { expect, test } from 'vitest'
import { markAnswer } from './model.js'

test('test mark answer', () => {
  const spellings = [[["foo"], ["bar", "baz"]], [["caz"]]];
  expect(
    markAnswer(
      spellings,
      ["KeyF", "KeyA"],
    )
  ).toStrictEqual(
    {
      correct: ["f"],
      incorrect: ["a"],
    }
  )

  expect(
    markAnswer(
      spellings,
      ["KeyF", "KeyA", "Backspace", "KeyO", "KeyO", "KeyB", "KeyA", "KeyZ", "Space", "KeyX"],
    )
  ).toStrictEqual(
    {
      correct: "foobaz ".split(""),
      incorrect: ["x"],
    }
  )
})