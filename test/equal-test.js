const assert = require('chai').assert
const mod = require('../index')

describe( 'things equal', () => {
  test( '0.3e2', 30 )
  test( '2m', 120 )
  test( '2h', '120m' )
  test( '48h', '2d' )

  test( '3.5', '3+12' )
  test( '3+12@48', {
    s: 3,
    f: 12,
    fps: 48
  } )


  test( new Date( 100 ), '0.1')
  test( new Date( '1970-01-03' ), '2d')
  test( '1970-01-03', '2d' )
  test( '1980-01-03', '1980-01-02T24:0:0' )


  // test( '3+15@30', '3+12' )


  function test( A, B ) {
    it( `${JSON.stringify(A)} == ${JSON.stringify(B)}`, () => {
      A = mod( A )
      B = mod( B )
      assert.deepEqual( A, B )
    } )
  }
})

describe( 'date', () => {

  it('derrive from move', () => {
    let result = mod('-3')
    console.log( result )
  })
})