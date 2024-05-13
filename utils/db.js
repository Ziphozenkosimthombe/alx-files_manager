import { MongoClient } from 'mongodb';
import { SHA1 } from './utils.js';

class DBClient {
  constructor () {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.connected = false;
    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    this.client
      .connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isAlive () {
    return this.connected;
  }

  async nbUsers () {
    await this.client.connect();
    return await this.client
      .db(this.database)
      .collection('users')
      .countDocuments();
  }

  async nbFiles () {
    await this.client.connect();
    return await this.client
      .db(this.database)
      .collection('files')
      .countDocuments();
  }

  async createUser (email, password) {
    const hash = SHA1(password);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .insertOne({ email, password: hash });
    return user;
  }

  async getUser (email) {
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({ email });
    return user;
  }

  async getUserById (id) {
    const _id = new mongodb.ObjectID(id);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({ _id });
    return user;
  }

  async userExists (email) {
    const user = await this.getUser(email);
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
