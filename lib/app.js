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


app.delete('/planets/:id', async (req, res) => {
  try {

    const id = req.params.id;

    const data = await client.query(`DELETE from planets 
    WHERE planets.id=$1 RETURNING *`, [id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});


app.put('/planets/:id', async (req, res) => {
  try {

    const id = req.params.id;

    const data = await client.query(`
    UPDATE planets 
    SET planet=$1, class=$2, diameter=$3, gravity=$4, magnetic_field_strong=$5, owner_id=$6
    WHERE id = $7
    RETURNING *
    `,
      [
        req.body.planet,
        req.body.class,
        req.body.diameter,
        req.body.gravity,
        req.body.magnetic_field_strong,
        req.body.owner_id,
        id
      ]);

    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

});



app.use(require('./middleware/error'));

module.exports = app;
