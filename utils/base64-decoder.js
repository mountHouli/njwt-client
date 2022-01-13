const base64 = require('base-64')

const { ACCESS_TOKEN_BASE64 } = process.env

console.log('ACCESS_TOKEN_BASE64')
console.log(ACCESS_TOKEN_BASE64)

const array = ACCESS_TOKEN_BASE64.split('.')

console.log('array -------------------------------------------------------')
console.log(array)


let header, payload, signature

[header, payload, signature] = array


// console.log('header -------------------------------------------------------')
// console.log(JSON.stringify(base64.decode(header), null, 2))
// console.log('payload -------------------------------------------------------')
// console.log(JSON.stringify(base64.decode(payload), null, 2))
// console.log('signature -------------------------------------------------------')
// console.log(JSON.stringify(base64.decode(signature), null, 2))

console.log('header -------------------------------------------------------')
console.log(JSON.parse(base64.decode(header)))
console.log('payload -------------------------------------------------------')
console.log(JSON.parse(base64.decode(payload)))
console.log('signature -------------------------------------------------------')
console.log(base64.decode(signature))

// let original = signature;
// let testCode64 = Buffer.from(original).toString('base64') 
// let testDecode64 = Buffer.from(testCode64, 'base64').toString('utf-8');
// let testDecode64 = Buffer.from(signature, 'base64').toString('utf-8');

// console.log('testCode64')
// console.log(testCode64)
// console.log('testDecode64')
// console.log(testDecode64)
