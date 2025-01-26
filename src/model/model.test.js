import { expect, test } from 'vitest'
import { markAnswer } from './model.js'

test('test mark answer', () => {
  const spellings = [[["foo"], ["bar", "baz"]], [["caz"]], [["daz"]]];
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
      ["KeyF", "KeyA", "Backspace", "KeyO", "KeyO", "KeyB", "KeyA", "KeyZ", "Space", "KeyC", "KeyA", "KeyZ", "Space", "Backspace", "Space", "KeyD", "KeyX"],
    )
  ).toStrictEqual(
    {
      correct: "foobaz caz d".split(""),
      incorrect: ["x"],
    }
  )
})