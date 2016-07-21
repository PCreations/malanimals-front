# Getting started
 - `git clone https://github.com/PCreations/malanimals-front.git`
 - `cd malanimals-front`
 - `npm install`

 **Running tests**
 - `npm run test`

# Running locally

## With heroku toolbelt

 - `heroku local` will runs the prod version locally (targetting the prod deployed app here : [`https://pacific-anchorage-35879.herokuapp.com/]`(https://pacific-anchorage-35879.herokuapp.com/))
 - open in your browser [`http://localhost:5000`](http://localhost:5000)

## With only node & npm

 - `npm run start:prod` to run the prod version
 - `npm run start` to run the development version

 When running development version you will see the ReduxDevTool Dock opened, you can change its position or hide/show it with these respective shortcuts :
 - `CTRL+W` (change dock position)
 - `CTRL+H' (hide/show)

 `CTRL` even for Mac users.

**Configuration**

You might want to edit the API endpoint in case you're toying with the backend app at a different port than default.
You can do so in the `webpack.config.js` file by editing the `MALANIMALS_API` variable.

# Deploy on Heroku

*Not really needed, just in case. Already deployed app is available here : [https://glacial-brook-44401.herokuapp.com/](https://glacial-brook-44401.herokuapp.com/)*

 - `cd` in the project root
 - `heroku create`
 - `git push heroku master`
 - `heroku ps:scale web=1`
 - `heroku open`
 - `heroku logs --tail` to check bundle creation progression