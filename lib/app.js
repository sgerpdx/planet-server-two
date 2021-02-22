const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/planets', async (req, res) => {
  try {
    const data = await client.query('SELECT * from planets');

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/planets/:id', async (req, res) => {
  try {

    const id = req.params.id;

    const data = await client.query(`SELECT * from planets WHERE planets.id=$1`, [id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});


app.post('/planets', async (req, res) => {
  try {
    // const newPlanet = {
    //   planet: 'saturn',
    //   class: 'gaseous',
    //   diameter: 116464,
    //   gravity: '1.1',
    //   magnetic_field_strong: true,
    //   owner_id: 1
    // }

    const data = await client.query(`
    INSERT into planets (planet, class, diameter, gravity, magnetic_field_strong, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
      [
        req.body.planet,
        req.body.class,
        req.body.diameter,
        req.body.gravity,
        req.body.magnetic_field_strong,
        req.body.owner_id
      ]);

    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ messge: e.message });
  }

});


app.use(require('./middleware/error'));

module.exports = app;
