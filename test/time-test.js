const assert = require('chai').assert

describe( 'time', () => {
  test( '30', 30000 )
  test( '0.3e2', 30000 )
  test( '30+12', 30500 )
  test( '30.5', 30500 )
  test( '30+30@60', 30500 )
  test( '1m', 60000 )
  test( '1:00', 60000 )
  test( '1m-1s', 59000 )
  test( '1m 30s', 90000 )
  test( '1:30', 90000 )
  test( '1h', 3600000 )
  test( '1:00:00', 3600000 )
  test( '1h 1m', 3660000 )
  test( '1h 1m 1s', 3661000 )
  test( '1h 1m 1.5s', 3661500 )
  test( '1h 1m 1.5s', 3661500 )
  test( '-30', -30000 )
  test( '1981-02-26', 0 )



  function test( str, expect ) {
    it( str, () => {
      const mod = require('../index')
      const ms = mod.time( str )
      assert.equal( ms, expect )
    } )
  }
})