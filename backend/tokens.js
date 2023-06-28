const { sign } = require('jsonwebtoken');

// Create tokens
// ----------------------------------
const createAccessToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

const createRefreshToken = (userId)  => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

// Send tokens
// ----------------------------------
const sendAccessToken = (res, req, accesstoken) => {
  res.send({
    accesstoken,
  });
};

const sendRefreshToken = (res, token, email, role) => {
  res.cookie('refreshtoken', token, {
    httpOnly: true,
    path: '/refresh_token',
  });
  res.cookie('email', email, {
    path: '/',
  });
  res.cookie('role', role, {
    path: '/',
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};
