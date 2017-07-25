# stock bot

# Install

`npm i`

# Setup

1. Go to [https://www.alphavantage.co/](https://www.alphavantage.co/) and get a
free API key.
2. Setup a S3 bucket.
3. Setup a node 6.x lamba with an alexa skill kit trigger.
3. Copy (and edit as needed) the code inside `./deploy.js` to another lamda
   which will act as your deployment function. Setup this lamda with
   a role which allows for lamda update and s3 permissions. Add an event to
   the bucket you just created above to trigger this deployment lamda based
   on a ObjectCreate events and key it to `stock-bot.zip`.
4. Add a file called `secrets.json` to your project root with the following
   data:
```
        {
            "appId": "your alexa skill id here",
            "bucketName": "your s3 bucket here",
            "keys": {
                "alphavantage": "your alpha vantage api key here"
            }
        }
```
