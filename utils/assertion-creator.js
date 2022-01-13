const fs = require('fs')

const uuid = require('uuid')
const njwt = require('njwt')

const { argv } = process

// console.log('argv[2] ------------------------------------')
// console.log(argv[2])
// console.log('argv[3] ------------------------------------')
// console.log(argv[3])
// console.log('argv[4] ------------------------------------')
// console.log(argv[4])

const algorithm = 'RS256'
const secret = fs.readFileSync(argv[2], 'utf8')

claims = {
  aud: argv[3],
  iss: argv[4],
  sub: argv[4],
  jti: uuid.v1()
}

const token = njwt.create(claims, secret, algorithm) // njwt lib
token.setExpiration(new Date().getTime() + 60 * 1000)

// console.log('token --------------------------------------------------------------------------')
// console.log(token)

console.log('Assertion:')
console.log(token.compact())
