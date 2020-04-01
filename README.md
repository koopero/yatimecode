`yatimecode` ( Yet Another Timecode Parser ) is a simple library for the flexible parsing on timecodes. This module is for parsing and addition of timecodes only: No attempt is made to format or further manipulate data.

## Features

- **Multiple inputs formats.** `yatimecode` aims to sucessfully parse as many useful, non-overlapping formats as possible, as well as novel combinations thereof. It is intended for easy, flexible curation of timecode data.
- **Parser never fails.** Invalid input will result in valid, albeit zero, output. 
- **Timecode addition.** Multiple timecodes may be added together, and timecodes may be negated for subtraction.
- **Seperate time and date.** Timecodes are output as a combination of time and date. This allows the optional parsing of a date portion of a timecode, while keeping high-resolution accuracy and sane ranges in the time portion.
- **Subframe accuracy.**  No rounding or quantization is attempted. 
- **Variable framerate.**  Frame rate is detected in parsing or configuration.
- **No dependencies.**  <6k code size.

# Usage

``` js
const yatimecode = require('yatimecode')

// result will match format below.
let result1 = parser('1:23:45')

// Add timecodes together
let result2 = yatimecode.add( '1f', '59:59+23' )

// Custom configuration of fps & loop
let parser = yatimecode.config( {
  fps: 24,
  loop: yatimcode.UNIT.D 
})

let result3 = parser('12:34:56+7')
```

## Output Format

``` js
{

}
```

## Input Formats

- `1999-02-26*` : [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) dates.
- `*@29.97` : Set frame rate.
- `51w 6d 23h 59m 59s 23f` : Any combination of whole or fractional numbers postfixed with units from week to frame.
- `23:59:59:23` : 4-numbers separated by `:` interprets as [SMPTE](https://en.wikipedia.org/wiki/SMPTE_timecode)-style timecode. *Note: Drop frame not supported at this time.*
- `02:34:56` : 3-number time interpreted as `hh:mm::ss`.
- `1:29:59+12` : Blender-style timecode plus frame offset. 
- `1.25` : Bare numbers treated as seconds.

## Looping


