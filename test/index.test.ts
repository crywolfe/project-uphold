import { priceChange } from '../src/index';

// afterAll((done) => {
//   done();
// });

beforeEach((done) => {
  done();

});

afterEach((done) => {
  done();
})

describe('index tests', () => {



  describe('setPair', () => {
    it('it should set the correct pair', () => {

    })

  })

  describe('Price Change', () => {

    it('it should return an Up Alert', () => {
      const previousAsk = 1;
      const currentAsk = 2;
      const pairName = 'GWW-USD'
      const oscillation = 0.01

      const expectedOutput = `Alert - Price Change of ${pairName} Ask Up ⬆️ more than ${oscillation}% from ${previousAsk} to ${currentAsk}`;

      expect(priceChange(pairName, previousAsk, currentAsk, oscillation)).toEqual(expectedOutput)

    }),

    it('it should return a Down Alert', () => {
      const previousAsk = 2;
      const currentAsk = 1;
      const pairName = 'GWW-USD'
      const oscillation = 0.01

      const expectedOutput = `Alert - Price Change of ${pairName} Ask Down ⬇️ more than ${oscillation}% from ${previousAsk} to ${currentAsk}`;

      expect(priceChange(pairName, previousAsk, currentAsk, oscillation)).toEqual(expectedOutput)

    }),

    test('it should not return an alert', () => {
      const previousAsk = 2;
      const currentAsk = 2;
      const pairName = 'GWW-USD'
      const oscillation = 0.01

      expect(priceChange(pairName, previousAsk, currentAsk, oscillation)).toEqual('')

    })
  })

})
