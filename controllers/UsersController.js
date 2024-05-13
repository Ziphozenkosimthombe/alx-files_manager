import dbClient from '../utils/db.js';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }

    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }

    const exists = await dbClient.userExists(email);

    if (exists) {
      res.status(400).json({ error: 'User already exists' });
      res.end();
      return;
    }

    const newUser = await dbClient.createUser(email, password);

    await newUser.save();

    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  }
}

export default UsersController;
