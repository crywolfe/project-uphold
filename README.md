## How to Run

There are three ways to run this application.
1. Locally or
2. Deployed (use Heroku or Next or Vercel) ??
3. Local via Docker Container

### Local
There is too much set up and many unknowns that can create problems for an inexperienced user to deploy locally, but essentially the user can do the following.
1. Clone this project from Github.
2. Navigate into the newly created directory.
3. run `npm install` (assuming the user has npm/node installed)
4. `npm run start`

### Deployed

TBD
### Docker

TBD

To run the db run the following command in the root of the app.
`docker-compose up -d`

To connect to the databse directly
`docker-compose exec db psql -U postgres -d uphold_data`

## Design

I decided to make the design a bit more functional in nature rather than object oriented in nature.

I am proficient in both but functional programming has its place in backend services.