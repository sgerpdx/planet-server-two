const client = require('../lib/client');
// import our seed data:
const { planets } = require('./planets.js');
const usersData = require('./users.js');
const { typesData } = require('./types.js');
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

    console.log(typesData);
    const types = await Promise.all(
      typesData.map(type => {
        return client.query(`
                      INSERT INTO types (name)
                      VALUES ($1)
                      RETURNING *;
                  `,
          [type.name]);
      })
    )


    const type = types[0].rows[0];

    //const types = responses.map(({ rows }) => rows[0]);
    //this needs to be either planets, or whatever we're mapping thru to insert into the types table


    await Promise.all(
      planets.map(planet => {
        return client.query(`
                    INSERT INTO planets (planet, diameter, gravity, magnetic_field_strong, owner_id, type_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
          [planet.planet, planet.diameter, planet.gravity, planet.magnetic_field_strong, planet.owner_id, planet.type_id]);
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
