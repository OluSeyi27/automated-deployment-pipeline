
import { createServer } from 'node:http';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cloud Pipeline Demo</title>
        </head>
        <body>
          <h1>Cloud Pipeline Demo</h1>
          <p>Our application is running successfully!</p>
          <p>Built with Node.js, Docker and GitHub Actions.</p>
        </body>
      </html>
    `);
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
  res.end(JSON.stringify({
    error: 'Route not found'
  }));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
