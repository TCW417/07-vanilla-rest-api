![cf](https://i.imgur.com/7v5ASc8.png) Lab 07: Vanilla HTTP Server
======
[![Build Status](https://travis-ci.org/TCW417/07-vanilla-rest-api.svg?branch=master)](https://travis-ci.org/TCW417/07-vanilla-rest-api)

## Cowsay!

### The API
  - GET Routes
    - /cowsay
      - Returns HTML with a random bit of text spouting from the cow. 
    - /api/cowsay?text="message"
      - Returns a JSON object with with a content property that is the results returned by the cowsay library with "message" inserted.
      - Returns 400 error if query string is missing or malformed.
    - /api/time
      - Returns a JSON string representing the current time in Javascript format.
    - /api/cowsayPage
      - Depricated. Use /api/cowsay.
  - POST Routes
    - /api/cowsay { text: "message" }
      - Similar to get GET route with the same path but takes a JSON object rather than a query string.
      - Returns a JSON object with the cow speaking.
      - Returns status 400 if body is missing or JSON is malformed.
    - /api/echo { "key": "value" }
      - Echos back to the console the JSON string created from the given key=value string in the body of the request.




