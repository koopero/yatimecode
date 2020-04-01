const mod = require('../index')
const assert = require('chai').assert

describe('add timecodes', () => {

  describe('standard adds', () => {

    test( '1h', '30m', '90m' )
    test( '1h', '-1m', '59m' )
    test( '1h', '23h', '1970-01-02' )



    function test( A, B, C ) {
      it( `${JSON.stringify(A)} + ${JSON.stringify(B)} == ${JSON.stringify(C)}`, () => {
        let R = mod.add( A, B )
        C = mod( C )
        assert.deepEqual( R, C )
      } )
    }
  })
})