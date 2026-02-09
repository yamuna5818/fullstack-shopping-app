// Single Vercel serverless handler for the Backend API (used when deploying frontend + backend together)
let app;
try {
  app = require('../Backend/server');
} catch (err) {
  console.error('Backend load error:', err);
  module.exports = (req, res) => {
    res.status(500).json({
      success: false,
      message: err.message || 'Backend failed to load. Check MONGODB_URI and logs.',
    });
  };
  return;
}
module.exports = app;
