import { expect, test } from 'vitest'
import { markAnswer } from './model.js'

test('test correct answer', () => {
  const spellings = [[["f"], ["o"], ["o"]], [["b"], ["a"], ["r", "z"]]]
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
})