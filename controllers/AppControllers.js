import redisClient from "../utils/redis.js";
import dbClient from "../utils/db.js";

class AppControllers {
  static getStatus(_req, res) {
    if (dbClient.isAlive() && redisClient.isAlive()) {
      return res.status(200).json({ redis: true, db: true });
    }
  }
  static async getStats(_req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    return res.status(200).json({ users, files });
  }
}

export default AppControllers;
