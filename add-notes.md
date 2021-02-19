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