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
          "id": 1,
          "planet": "mercury",
          "class": "terrestrial",
          "diameter": 4880,
          "gravity": "0.4",
          "magnetic_field_strong": false,
          "owner_id": 1
        },
        {
          "id": 2,
          "planet": "venus",
          "class": "terrestrial",
          "diameter": 12102,
          "gravity": "0.9",
          "magnetic_field_strong": false,
          "owner_id": 1
        },
        {
          "id": 3,
          "planet": "earth",
          "class": "terrestrial",
          "diameter": 12742,
          "gravity": "1.1",
          "magnetic_field_strong": true,
          "owner_id": 1
        },
        {
          "id": 4,
          "planet": "mars",
          "class": "terrestrial",
          "diameter": 6778,
          "gravity": "0.4",
          "magnetic_field_strong": false,
          "owner_id": 1
        },
        {
          "id": 5,
          "planet": "jupiter",
          "class": "gaseous",
          "diameter": 139822,
          "gravity": "2.5",
          "magnetic_field_strong": true,
          "owner_id": 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/planets')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns a single planet by id', async () => {

      const expectation = {
        'id': 4,
        'planet': 'mars',
        'class': 'terrestrial',
        'diameter': 6778,
        'gravity': "0.4",
        'magnetic_field_strong': false,
        'owner_id': 1,
      };

      const data = await fakeRequest(app)
        .get('/planets/4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('creates and inserts a new planet into our list of planets', async () => {

      const newPlanet = {
        'id': 6,
        'planet': 'saturn',
        'class': 'gaseous',
        'diameter': 116464,
        'gravity': '1.1',
        'magnetic_field_strong': true,
        'owner_id': 1,
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

      const saturn = allPlanets.body.find(planet => planet.name === 'saturn');

      expect(newPlanet).toEqual(expectedPlanet);

    });



  });
});
