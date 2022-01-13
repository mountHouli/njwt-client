const fs = require('fs')
const url = require('url')

const uuid = require('uuid')
const njwt = require('njwt')

const axios = require('axios')
axios.interceptors.response.use(response => {
  return response;
}, error => {
  return error;
});

const express = require('express')
const app = express()

const port = 1776
const algorithm = 'RS256'
const { env } = process
const {
  FILE_PATH_TO_PRIVATE_RSA_KEY,
  CLIENT_ID,
  JWT_AUD,
  TOKEN_URL,
} = env
const secret = fs.readFileSync(FILE_PATH_TO_PRIVATE_RSA_KEY, 'utf8')

console.log('secret')
console.log(secret)

console.log('FILE_PATH_TO_PRIVATE_RSA_KEY')
console.log(FILE_PATH_TO_PRIVATE_RSA_KEY)

console.log('CLIENT_ID')
console.log(CLIENT_ID)

console.log('JWT_AUD')
console.log(JWT_AUD)

console.log('TOKEN_URL')
console.log(TOKEN_URL)





let token = null
let authTestToken = null

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ----------------------------------------`)
  next()
})

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/getToken', async (req, res, next) => {

  const { icn } = req.query

  const tokenRes = await getToken(icn)

  res.status(200).send(tokenRes)
})


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/authTest', async (req, res) => {
  const { icn } = req.query

  console.log('icn')
  console.log(icn)

  // if (!authTestToken) {
  //   authTestToken = (await getToken(icn)).access_token
  // }

  console.log('authTestToken')
  console.log(authTestToken)

  const config = {
    headers: {
      Authorization: `Bearer ${authTestToken}`
    }
  }
  console.log('config')
  console.log(config)

  let response = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=8302-2`, config)

  console.log('response.data 1 --------------------------------------------------------')
  console.log(response.data)

  if (response?.data?.issue?.details?.text === 'invalid token.') {
    authTestToken = (await getToken(icn)).access_token
    response = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=8302-2`, config)


    console.log('response.data 2 --------------------------------------------------------')
    console.log(response.data)
  }

  res.status(200).json(response.data)
})

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// makeRequest('get', url, token)

// async function makeRequest(method, url, mrToken) {

//   const config = {
//     headers: {
//       Authorization: `Bearer ${mrToken}`
//     }
//   }

//   let response = axios[method](url, config)

//   if (response?.data?.issue?.details?.text === 'invalid token.') {
//     mrToken = (await getToken(icn)).access_token
//     const config = {
//       headers: {
//         Authorization: `Bearer ${mrToken}`
//       }
//     }
//     response = axios[method](url, config)
//   }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/getBloodPressure', async (req, res) => {
  const { icn } = req.query

  console.log('icn')
  console.log(icn)

  token = (await getToken(icn)).access_token

  console.log('token')
  console.log(token)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  console.log('config')
  console.log(config)

  // Height and Weight -----------------------------------------------------------------------------
  // const ob1 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=8302-2`, config)
  // const ob2 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=29463-7`, config)

  // Blood Pressure --------------------------------------------------------------------------------
  // const ob1 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=85354-9`, config)
  // const ob2 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=8480-6`, config)
  // const ob3 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=8478-0`, config)
  // const ob4 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=8357-6`, config)
  // const ob5 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=41904-4`, config)
  // const ob6 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=8358-4`, config)
  // const ob7 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=41901-0`, config)

  // Correct Blood Pressure (Per Bryan Schofield) --------------------------------------------------
  // &date=gt1998-01-01&date=lt1998-12-31
  // &date=ge1998-01-01&date=le1998-12-31
  // 1998 = 11 results
  // 1997 = 12 results
  // 1996 = 8 results
  // &date=ne1996&date=ne1997&date=ne1998
  // 1996-08-16T02:42:52Z
  const ob1 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=55284-4&date=ge1996-01-01&date=le1996-08-16T02:42:52Z`, config)
  // const ob2 = await axios.get(`https://sandbox-api.va.gov/services/fhir/v0/r4/Observation?patient=${icn}&category=vital-signs&code=85354-9&date=ge1998-01-01&date=1998-12-31`, config)

  const results = [ob1.data] //, ob1.data] //, ob2.data, ob3.data, ob4.data, ob5.data, ob6.data, ob7.data]

  res.status(200).json(results)
})


// issue.details.text === 'invalid token.'

////////////////////////////////////////////////////////////////////////////////////////////////////
// Listen //////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server')
    console.error(err)
    process.exit(1)
  }
  console.log(`Server started on port: ${port}`)
})

////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper Function /////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
async function getToken (icn) {

  claims = {
    aud: JWT_AUD,
    iss: CLIENT_ID,
    sub: CLIENT_ID,
    jti: uuid.v1()
  }

  const assertion = njwt.create(claims, secret, algorithm) // njwt lib
  assertion.setExpiration(new Date().getTime() + 600 * 1000)
  assertion.compact() // Convert to Base64

  const body = new url.URLSearchParams()
  body.append('grant_type', 'client_credentials')
  body.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer')
  body.append('client_assertion', assertion)
  body.append('scope', 'launch/patient patient/Patient.read patient/Observation.read patient/Medication.read')
  body.append('launch', icn)

  let tokenRes
  try {
    tokenRes = await axios.post(TOKEN_URL, body)
  }
  catch (err) {
    console.error('getToken(): err:')
    console.error(err)
  }

  console.log('tokenRes.data')
  console.log(tokenRes.data)

  return tokenRes.data

}

