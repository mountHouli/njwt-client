# To Create an OAuth Assertion...

...to use to fetch an access token from Lighthouse, via the Client Credentials OAuth Grant type

```sh
node utils/assertion-creator.js '/local/path/to/your/private/rsa/key/file/used/to/generate/your/lighthouse/client/id.pem' 'https://lighthouse-jwt-aud-url.com' 'YOUR_LIGHTHOUSE_CLIENT_ID_CORRESPONDING_TO_YOUR_PRIVATE_RSA_KEY'
```

# To Decode a JWT

Set env var `ACCESS_TOKEN_BASE64=the_base64_encoded_access_token_lighthouse_returned_to_you`

```sh
npm run decode-token
```

# Also see...

There's some `package.json` scripts (obviously), and there's a little web server (`app.js`)
