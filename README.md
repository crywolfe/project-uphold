## How to Run

There are three ways to run this application.
1. Locally or
2. Deployed on Heroku or 
3. Local via Docker Container

### Local
There is too much set up and many unknowns that can create problems for an inexperienced user to deploy locally, but essentially the user can do the following.
1. Clone this project from Github.
2. Navigate into the newly created directory.
3. run `npm install` (assuming the user has npm/node installed)
4. run `npm run start`

### Deployed

The app is deployed on Heroku at the following URL.
https://thawing-fjord-50659.herokuapp.com/ | https://git.heroku.com/thawing-fjord-50659.git
### Docker
Note: All the commands below need to be run using a terminal shell and done so in the root folder of the app.

1. Clone this project from Github.
2. Ensure Docker is installed and running.
3. Run `docker-compose down --remove-orphans`
4. Run `docker-compose up -d`
5. Run `npm run start`

To connect to the database directly
`docker-compose exec db psql -U postgres -d uphold_data`

## Design

I decided to make the design a bit more functional in nature rather than object oriented in nature.

I am proficient in both but functional programming has its place in backend services.