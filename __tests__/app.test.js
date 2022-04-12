const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/github/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should redirect to posts when user is logged in', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

      expect(res.req.path).toEqual('/api/v1/posts');
  });

  it('should log out a user and eat their cookie', async () => {
    const res = await request(app)
      .delete('/api/v1/github');

    expect(res.body).toEqual({
      success: true,
      message: 'You have logged out'
    });
  });

  it('should list all posts for users', async () => {
    const agent = request.agent(app);
    await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    
    const res = await agent
      .get('/api/v1/geets');

    
    const expected = [{
      id: expect.any(String),
      title: 'this is a geet',
      description: 'it is super secret and how are you reading this?',
    }, {
      id: expect.any(String),
      title: 'my second geet',
      description: 'seriously stop reading my secret geets',
    }];

    expect(res.body).toEqual(expected);
  });

  it('should allow a logged in user to post a geet', async () => {
    const agent = request.agent(app);

    await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    const res = await agent
      .post('/api/v1/geets')
      .send({
        title: 'secret geet',
        description: 'uber secrets no eyes!'
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'secret geet',
      description: 'uber secrets no eyes!'
    });
  });

  it('should get 3 quotes from 3 different apis', async () => {
    const expected = [
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
    ];
    const res = await request(app).get('/api/v1/quotes');
    expect(res.body).toEqual(expected);
  });
});