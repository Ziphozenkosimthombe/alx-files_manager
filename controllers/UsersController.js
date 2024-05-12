import dbClient from '../utils/db.js';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      const existingUser = await dbClient.existingUser(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      if (!email) {
        return res.status(400).json({ erro: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ erro: 'Missing password' });
      }

      const newUser = await dbClient.createUser(email, hashedPassword);
      await newUser.save();

      if (newUser) {
        res.status(201).json({
          _id: newUser._id,
          email: newUser.email,
          password: newUser.password,
        });
      } else {
        res.status(400).json({ error: 'Invalid data' });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default UsersController;
