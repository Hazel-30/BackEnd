const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const maxSize = 1024 * 1024; // 1MB
const logFileName = 'requests.log';

// Function to rotate the log file when it reaches a certain size
function rotateLogFile() {
  if (fs.existsSync(logFileName)) {
    const stats = fs.statSync(logFileName);
    if (stats.size >= maxSize) {
      const newFileName = `requests-${new Date().toISOString().replace(/:/g, '-')}.log`;
      fs.renameSync(logFileName, newFileName);
    }
  }
}

// Middleware to log request details
app.use((req, res, next) => {
  rotateLogFile();

  const logDetails = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    url: req.originalUrl,
    protocol: req.protocol,
    method: req.method,
    hostname: req.hostname,
    query: req.query,
    headers: req.headers,
    userAgent: req.get('User-Agent'),
  };

  fs.appendFile(logFileName, JSON.stringify(logDetails) + '\n', (err) => {
    if (err) {
      console.error('Error writing to log file', err);
    }
  });

  next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

  