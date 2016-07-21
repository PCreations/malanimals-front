# Running tests

 - `cd` in the project root
 - `npm run test

# Run locally

## With heroku toolbelt

 - `cd` in the project root
 - `heroku local` will runs the prod version locally
 - open in your browser [`http://localhost:5000`](http://localhost:5000)

## With only node & npm

 - `npm run start:prod` to run the prod version
 - `npm run start` to run the development version

**Configuration**

You might want to edit the API endpoint in case you're toying with the backend app.
You can do so in the `webpack.config.js` file by editing the `MALANIMALS_API` variable.


# Deploy on Heroku

*Not really needed, just in case. Already deployed app is available here : [https://glacial-brook-44401.herokuapp.com/](https://glacial-brook-44401.herokuapp.com/)*

 - `cd` in the project root
 - `heroku create`
 - `git push heroku master`
 - `heroku ps:scale web=1`
 - `heroku open`