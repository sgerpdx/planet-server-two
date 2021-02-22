const client = require('../lib/client');
// import our seed data:
const { planets } = require('./planets.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
          [user.email, user.hash]);
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      planets.map(planet => {
        return client.query(`
                    INSERT INTO planets (planet, class, diameter, gravity, magnetic_field_strong, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
          [planet.planet, planet.class, planet.diameter, planet.gravity, planet.magnetic_field_strong, planet.owner_id]);
      })
    );


    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
