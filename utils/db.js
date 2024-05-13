#!/usr/bin/env node

import { MongoClient } from 'mongodb';
import { SHA1 } from './utils.js';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.connected = false;
    this.url = `mongodb://${this.host}:${this.port}/${this.database}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.client
      .connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    await this.client.connect();
    const users = await this.client
      .db(this.database)
      .collection('users')
      .countDocuments();
    return users;
  }

  async nbFiles() {
    await this.client.connect();
    const files = await this.client
      .db(this.database)
      .collection('files')
      .countDocuments();
    return files;
  }

  async createUser(email, password) {
    const hash = SHA1(password);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .insertOne({ email, password: hash });
    return user;
  }

  async getUser(email) {
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({ email }).exec();
    if (!user) {
      return null;
    } else {
      return user;
    }
  }

  async getUserById(id) {
    const _id = new mongodb.ObjectID(id);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({ _id }).exec();
    if (!user) {
      return null;
    } else {
      return user;
    }
  }

  async userExists(email) {
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
