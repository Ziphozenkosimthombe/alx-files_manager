#!/usr/bin/env node

import pkg from 'mongodb';
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
}

const dbClient = new DBClient();
export default dbClient;
