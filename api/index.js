// This file is the entry point for Vercel API deployment
import app from '../server/src/app.js';

// This allows our API routes to work as a serverless function
export default async function handler(req, res) {
  // Forward the request to our Express app
  return new Promise((resolve, reject) => {
    // Create a mock Express req/res objects
    const expressReq = {
      ...req,
      url: req.url,
      path: req.url,
      query: req.query,
      params: {},
      body: req.body,
      headers: req.headers,
      method: req.method
    };

    const expressRes = {
      ...res,
      status: (code) => {
        res.status(code);
        return expressRes;
      },
      json: (data) => {
        res.json(data);
        resolve();
        return expressRes;
      },
      send: (data) => {
        res.send(data);
        resolve();
        return expressRes;
      },
      end: (data) => {
        if (data) res.end(data);
        else res.end();
        resolve();
        return expressRes;
      },
      setHeader: (name, value) => {
        res.setHeader(name, value);
        return expressRes;
      }
    };

    // Pass the request to our Express app
    app(expressReq, expressRes, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
} 