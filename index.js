const S = 1*1000
const M = 60*S
const H = 60*M
const D = 24*H
const W = 7*D


const UNIT = {
  S,M,H,D,W,
  F:S,
  SECONDS:S,
  SEC:S,
  HOUR:H,HOURS:H,HRS:H,
  DAYS:D,DAY:D,
}

const KEYS = Object.keys( UNIT )

module.exports = config()

const { floor, abs } = Math

function config( opt ) {
  if ( 'string' == typeof opt )
    opt = parseFloat( opt )

  if ( 'number' == typeof opt && !isNaN( opt ) )
    opt = { fps: opt }
    
  opt = Object.assign( {
    fps: 24,
    loop: UNIT.D,
  }, 'object' == typeof opt ? opt : {} )

  const { loop, fps } = opt

  function parse( arg ) {
    let val = {
      day: new Date( 0 ),
      loop,
      fps,
      time: 0,
    }

    parseArg( arg )

    if ( val.str )
      val = parseString( val )

    function parseArg( arg ) {
      if ( 'number' == typeof arg )
        arg = arg.toString()

      if ( 'string' == typeof arg ) {
        Object.assign( val, parseString( val, arg ) )
      } else if ( arg && 'function' == typeof arg.getTime ) {
        Object.assign( val, parseDate( val, arg ) )
      } else if ( 'object' == typeof arg && arg ) {
        Object.assign( val, parseObject( val, arg ) )
      }

    }

    val = package( val )
    return val 
  }

  function parseDate( { time, day, loop }, date ) {
    if ( !date )
      return { time, day }

    if ( 'string' == typeof date )
      date = Date.parse( date )

    if ( 'function' == typeof date.getTime )
      time += date.getTime()

    day = day || new Date( 0 )
    
    return { time, day }
  }


  function parseObject( val, ob ) {
    let { day } = val
    let { time, fps, str } = ob
    fps = parseFloat( fps ) || val.fps
    time = ( parseFloat( time ) || 0 ) + val.time

    let date = parseDate( { time, day, loop }, ob.day )
    time += date.time
    day = date.day
    time = parseFloat( time ) || 0

    let keys = Object.keys( ob )

    for ( let key of keys ) {
      let val = parseFloat( ob[key] )
      if ( !val ) continue 
      key = key.toUpperCase()
      val *= UNIT[ key ]

      if ( key[0] == 'F' ) 
        val /= fps

      if ( !val ) continue 
      time += val
    }

    return { time, day, fps, str } 
  }

  function parseString( { day, loop, fps, time }, str ) {
    if ( 'string' != typeof str )
      str = String( str )
  
    let negate = 1

    // ISO dates
    function setDayISO( nil, iso ) {
      let date = Date.parse( iso )
      if ( !isNaN( date ) )
        day.setTime( date )
      return ''
    }

    str = str.replace(/^(\d\d\d\d\-\d\d\-\d\d)T?/, setDayISO )

    str = str.replace(/^[+-]/, function setfps( sign ) {
      if ( sign == '-' ) 
        negate *= -1
      return ''
    })

    str = str.replace(/@(\d+(?:\.\d*)?)$/, function setfps( nil, val ) {
      val = parseFloat( val )      
      fps = val 
      return ''
    })

    str = str.replace(/\+(\d+(?:\.\d*)?)$/, function addFrames( nil, val ) {
      time += negate * UNIT.S / fps * parseFloat( val ) || 0
      return ''
    })

    str = str.replace(/([\+\-]?)(\d+(?:\.\d*)?(?:[Ee][+-]?\d+)?)([hmsdw])/g, function named( nil, sign, val, unit ) {
      if ( sign == '-' )
        negate *= -1

      unit = unit.toUpperCase()
      time += negate * val * UNIT[ unit ] || 0 
      return ''
    })

    let cols = []

    str = str.replace(/(\d+)\:/g, function ( nil, val ) {
      val = parseFloat( val ) || 0
      cols.push( val )
      return ''
    })

    let len = cols.length
    if ( len == 1 ) {
      time += negate * cols[0] * UNIT.M
    } else if ( len == 2 ) {
      time += negate * cols[0] * UNIT.H
      time += negate * cols[1] * UNIT.M
    } else if ( len == 3 ) {
      // Not implemented
    }

    time += negate * parseFloat( str ) * UNIT.S || 0

    return { day, time, fps }
  }



  function package( { day, time, fps } ) {
    let daytime = day.getTime()
    let sign = time && time / abs( time )
    let loops = floor( time / loop * sign ) * sign
    time -= loops * loop
    daytime += loops * loop
    day.setTime( daytime )

    let second = time / UNIT.S
    let seconds = second
    let frame = second * fps

    if ( second < 0 )
      second += loop / S

    let minute = 0
    let hour = 0
    let frames = 0

    minute = floor( second / 60 )
    second -= minute * 60

    hour = floor( minute / 60 )
    minute -= hour * 60
    time += frames / fps * 1000

    return {
      fps,
      time,
      seconds,
      day,
      second,
      minute,
      hour,
      frame,
    }
  }

  parse.time = function time( str ) {
    return parse( str ).time  
  }

  parse.add = function parseAndAdd() {
    let first = parse( arguments[0] )
    for ( let i = 1; i < arguments.length; i ++ ) {
      let next = parse( arguments[i] )

      first.day.setTime( first.day.getTime() + next.day.getTime() )
      first.time += next.time 
    }

    return package( first )
  }

  parse.config = config

  parse.UNIT = UNIT

  return parse
}

