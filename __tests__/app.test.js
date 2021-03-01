require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const { all } = require('../lib/app');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test('returns planets', async () => {

      const expectation = [
        {
          'id': 4,
          'planet': 'mars',
          'planet_type': 'terrestrial',
          'diameter': 6778,
          'gravity': '0.4',
          'magnetic_field_strong': false,
          'owner_id': 1,
          'type_id': 1
        },
        {
          "id": 3,
          "planet": "earth",
          "planet_type": "terrestrial",
          "diameter": 12742,
          "gravity": "1.1",
          "magnetic_field_strong": true,
          "owner_id": 1,
          "type_id": 1
        },
        {
          "id": 2,
          "planet": "venus",
          "planet_type": "terrestrial",
          "diameter": 12102,
          "gravity": "0.9",
          "magnetic_field_strong": false,
          "owner_id": 1,
          "type_id": 1
        },
        {
          "id": 1,
          "planet": "mercury",
          "planet_type": "terrestrial",
          "diameter": 4880,
          "gravity": "0.4",
          "magnetic_field_strong": false,
          "owner_id": 1,
          "type_id": 1
        },
        {
          "id": 5,
          "planet": "jupiter",
          "planet_type": "gaseous",
          "diameter": 139822,
          "gravity": "2.5",
          "magnetic_field_strong": true,
          "owner_id": 1,
          "type_id": 2
        }
      ];

      const data = await fakeRequest(app)
        .get('/planets')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns planet types', async () => {

      const expectation = [
        {
          'id': 1,
          'name': 'terrestrial'
        },
        {
          'id': 2,
          'name': 'gaseous'
        }
      ];

      const data = await fakeRequest(app)
        .get('/types')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });




    test('returns a single planet by id', async () => {

      const expectation = {
        'id': 4,
        'planet': 'mars',
        'planet_type': 'terrestrial',
        'diameter': 6778,
        'gravity': "0.4",
        'magnetic_field_strong': false,
        'owner_id': 1,
        'type_id': 1
      };

      const data = await fakeRequest(app)
        .get('/planets/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('creates and inserts a new planet into our list of planets', async () => {

      const newPlanet = {
        'planet': 'saturn',
        'diameter': 116464,
        'gravity': '1.1',
        'magnetic_field_strong': true,
        'owner_id': 1,
        'type_id': 2
      };

      const expectedPlanet = {
        ...newPlanet,
        id: 6
      };

      const data = await fakeRequest(app)
        .post('/planets')
        .send(newPlanet)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectedPlanet);

      const allPlanets = await fakeRequest(app)
        .get('/planets')
        .expect('Content-Type', /json/)
        .expect(200);

      const saturn = allPlanets.body.find(planet => planet.planet === 'saturn');

      expect(saturn).toEqual({ ...expectedPlanet, planet_type: 'gaseous' });

    });


    test('deletes a planet from the list by id', async () => {

      const expectation = {
        'id': 4,
        'planet': 'mars',
        'diameter': 6778,
        'gravity': '0.4',
        'magnetic_field_strong': false,
        'owner_id': 1,
        'type_id': 1
      };

      const data = await fakeRequest(app)
        .delete('/planets/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

      const emptySpace = await fakeRequest(app)
        .get('/planets/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(emptySpace.body).toEqual('');

    });


    test('updates a planet object', async () => {

      const newPlanet = {
        'planet': 'futureEarth',
        'planet_type': 'terrestrial',
        'diameter': 14400,
        'gravity': '1.3',
        'magnetic_field_strong': true,
        'owner_id': 1,
        'type_id': 1
      };

      const expectedPlanet = {
        ...newPlanet,
        id: 3
      };

      await fakeRequest(app)
        .put('/planets/3')
        .send(newPlanet)
        .expect('Content-Type', /json/)
        .expect(200);

      const updatedPlanet = await fakeRequest(app)
        .get('/planets/3')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(updatedPlanet.body).toEqual(expectedPlanet);

    });


  });
});
