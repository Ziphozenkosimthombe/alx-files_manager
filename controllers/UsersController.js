import dbClient from '../utils/db';

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
}

export default UsersController;
