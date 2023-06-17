const jwt = require('jsonwebtoken')

const { getKey, getNewKey } = require('@config')

const ADMIN_KEY = getKey('ADMIN_SECRET_KEY') || getNewKey('ADMIN_SECRET_KEY')

function generateAccessToken(payload) {
  return jwt.sign(payload, ADMIN_KEY, { expiresIn: '1h' })
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, ADMIN_KEY, { expiresIn: '7d' })
}

function verifyToken(token) {
  try {
    const { exp } = jwt.verify(token, ADMIN_KEY)
    return exp - Math.floor(Date.now() / 1000)
  } catch (err) {
    return false
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
}