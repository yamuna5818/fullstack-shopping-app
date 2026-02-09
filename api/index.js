// Single Vercel serverless handler for the Backend API (used when deploying frontend + backend together)
const app = require('../Backend/server');
module.exports = app;
