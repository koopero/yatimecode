const mod = require('../index')

describe("with custom config", () => {
  describe("one hour loop", () => {
    let parser
    it('will initialize parser', () => {
      parser = mod.config( { loop: '1h' } )
    })


  })
})