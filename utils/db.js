#!/usr/bin/env node

import pkg from 'mongodb';
import { SHA1 } from './util.js';
const { MongoClient } = pkg;

class DBClient {
  constructor () {
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

  isAlive () {
    return this.connected;
  }

  async nbUsers () {
    await this.client.connect();
    const users = await this.client
      .db(this.database)
      .collection('users')
      .countDocuments();
    return users;
  }

  async nbFiles () {
    await this.client.connect();
    const files = await this.client
      .db(this.database)
      .collection('files')
      .countDocuments();
    return files;
  }

  async createUser (email, password) {
    const hashPassword = SHA1(password);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .insertOne({ email, password: hashPassword });
    return user;
  }

  async findUser (email) {
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .find({ email })
      .toArray();
    if (!user) {
      return null;
    }
    return user[0];
  }

  async findUserById (id) {
    const _id = MongoClient.ObjectId(id);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .find({ _id })
      .toArray();
    if (!user) {
      return null;
    }
    return user[0];
  }

  async existingUser (email) {
    const user = await this.findUser(email);
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
