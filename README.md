# Create Alchemy SQL BE

## Getting started
1. Clone your repo down and run `npm i` to install dependencies.
1. Change all the files in the `data` directory to match the data model of your app.
1. Run `heroku create`
1. Run `npm run setup-heroku` to create a heroku SQL database in the cloud to go with your heroku app.
1. Run `heroku config:get DATABASE_URL` to get your heroku sql database url from the cloud.
1. Put the database URL in your .env file, under `DATABASE_URL`. (Don't forget to changge the file name from `.env-example` to `.env`!)
1. Run `npm run setup-db`
1. Run `npm run start:watch` to start the dev server
1. Routes are in `app.js`, not in `server.js`. This is so our tests will not launch a server every time.

## HARD MODE: Override default queries

```js
// OPTIONALLY pass in new queries to override defaults

const authRoutes = createAuthRoutes({
    selectUser(email) {
        return client.query(`
            SELECT id, email, hash
            FROM users
            WHERE email = $1;
        `,
        [email]
        ).then(result => result.rows[0]);
    },
    insertUser(user, hash) {
        console.log(user);
        return client.query(`
            INSERT into users (email, hash)
            VALUES ($1, $2)
            RETURNING id, email;
        `,
        [user.email, hash]
        ).then(result => result.rows[0]);
    }
});
```

Notes:
// Today: connect yesterday to a live SQL database (also Heroku)
//

// "distributed development" -- lots of different terminals
// 

// https://github.com/alchemycodelab/foundations-ii-february-2021/blob/master/curriculum/06-sql-express/day-two.md
// Easy Mode: ignore "use this template"

// CRUD -- API operations: Create, Read, Update, Destroy/Delete (90% of career will be building CRUD apps)
// ( SQL = INSERT, SELECT, UPDATE, DELETE)

// command line: npx create-alchemy-sql-be
// candy-bar-server
// muchos dependencies installed
// cd into candy-bar-server
//
// "endpoints know how to talk to SQL"

// we need to find a way to "seed"/fill the database, which is empty...
// index.js

// can run commands (scripts) from package.json

// go:
// <files>
// heroku create
// npm run setup-heroku  (this creates the db to bgn w/...but empty)
// > check postgress (best version of SQL) URL that Heroku generates...
// ***don't download postgress until career track***
// now .env can get the URL

// npm run setup-db  ...will look into our data and use it to fill database?
// npm run start:watch
// go to postman and put in lh3k/planets and we'll see our seed data

// all of SQL is hacking--terminal in household--

// 