import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppControllers {
  static getStatus (_req, res) {
    if (dbClient.isAlive() && redisClient.isAlive()) {
      res.status(200).json({ redis: true, db: true });
      res.end();
    }
  }

  static async getStats (_req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.status(200).json({ users, files });
    res.end();
  }
}

export default AppControllers;
