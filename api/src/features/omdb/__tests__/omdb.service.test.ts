import { parseOMDbSeriesRuntime, parseOMDbSeriesYears } from '../omdb.service'

describe('features/omdb/omdb.service', () => {
  describe('parseOMDbSeriesYears', () => {
    it.each([
      ['2022', 2022, 2022],
      ['2022–', 2022, null],
      ['2022–2023', 2022, 2023],
    ])(
      'parses %j as start: %j, end: %j',
      (years, expectedStart, expectedEnd) => {
        expect(parseOMDbSeriesYears({ years })).toEqual({
          startYear: expectedStart,
          endYear: expectedEnd,
        })
      },
    )
  })

  describe('parseOMDbSeriesRuntime', () => {
    it('parses the number of minutes from the runtime', () => {
      expect(parseOMDbSeriesRuntime({ runtime: '25 mins' })).toBe(25)
    })
  })
})
