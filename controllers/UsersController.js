import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      const exists = await dbClient.userExists(email);

      if (exists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const newUser = await dbClient.createUser(email, password);
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      console.log('on token if statement');
      res.status(401).json({ error: 'Unauthorized' });
    }
    const id = await redisClient.get(`auth_${token}`);
    if (!id) {
      console.log('on id if statement');
      res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await dbClient.getUserById(id);
    if (!user) {
      console.log('on users if statement');
      res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ id: user._id, email: user.email }).end();
  }
}

export default UsersController;
