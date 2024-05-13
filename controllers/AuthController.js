import { v4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import GenerateAuthToken from '../utils/gerateAuthToken';
import { SHA1 } from '../utils/utils';

class AuthController {
  static async getConnect(req, res) {
    try {
      const { getAuthzHeader, getToken, decodeToken, getCredentials } =
        GenerateAuthToken;
      const authzHeader = getAuthzHeader(req);
      if (!authzHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const token = getToken(authzHeader);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { email, password } = getCredentials(decodedToken);
      const user = await dbClient.getUser(email);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (user.password !== SHA1(password)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const accessToken = v4();
      await redisClient.set(
        `auth_${accessToken}`,
        user._id.toString('utf8'),
        60 * 60 * 24
      );
      return res.json({ token: accessToken });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getDisconnect(req, res) {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const id = await redisClient.get(`auth_${token}`);
      if (!id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = await dbClient.getUserById(id);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await redisClient.del(`auth_${token}`);
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default AuthController;
