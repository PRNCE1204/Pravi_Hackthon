const jwt = require('jsonwebtoken');

/**
 * Generate JWT token valid for 7 days
 * @param {string} userId - User MongoDB _id
 * @param {string} role - User role
 * @returns {string} - Signed JWT
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'hackathon_super_secret_jwt_key_2026',
    {
      expiresIn: '7d',
    }
  );
};

module.exports = generateToken;
