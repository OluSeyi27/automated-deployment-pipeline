
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createServer } from 'node:http';

let server;
let baseUrl;

describe('Cloud Pipeline Demo', () => {
  before(async () => {
    server = createServer((req, res) => {
      if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Cloud Pipeline Demo</h1>');
        return;
      }

      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'healthy',
          message: 'Application is running'
        }));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Route not found' }));
    });

    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  it('should display the homepage', async () => {
    const response = await fetch(baseUrl);

    assert.equal(response.status, 200);

    const body = await response.text();
    assert.match(body, /Cloud Pipeline Demo/);
  });

  it('should return a healthy status', async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);

    const body = await response.json();
    assert.equal(body.status, 'healthy');
  });

  it('should return 404 for an unknown route', async () => {
    const response = await fetch(`${baseUrl}/unknown`);

    assert.equal(response.status, 404);
  });
});
