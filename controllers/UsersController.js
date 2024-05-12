import dbClient from '../utils/db.js';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) {
        res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        res.status(400).json({ error: 'Missing password' });
      }

      const exists = await dbClient.userExists(email);
      if (exists) {
        res.status(400).json({ error: 'User already exists' });
      }

      const newUser = await dbClient.createUser(email, password);
      if (newUser) {
        res.status(201).json({
          _id: newUser._id,
          email: newUser.email,
        });
      } else {
        res.status(500).json({ error: 'Error creating user' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default UsersController;
