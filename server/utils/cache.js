const NodeCache = require('node-cache');

// Create a new cache instance with a default TTL of 5 minutes
const nodeCache = new NodeCache({
  stdTTL: 300, // 5 minutes in seconds
  checkperiod: 60 // Check for expired keys every minute
});

const cache = {
  async get(key) {
    return nodeCache.get(key);
  },

  async set(key, value, ttl = 300) {
    return nodeCache.set(key, value, ttl);
  },

  async del(key) {
    return nodeCache.del(key);
  },

  async flush() {
    return nodeCache.flushAll();
  }
};

module.exports = cache; 