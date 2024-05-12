#!/usr/bin/env node

import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor () {
    this.client = createClient();
    this.client.on('error', (err) => console.log(err));
    this.connected = false;
    this.client.on('connect', () => {
      this.connected = true;
    });
  }

  isAlive () {
    return this.connected;
  }

  async get (key) {
    const getAsyncFunc = promisify(this.client.get).bind(this.client);
    const value = await getAsyncFunc(key);
    return value;
  }

  async set (key, val, dur) {
    const setAsyncFunc = promisify(this.client.set).bind(this.client);
    await setAsyncFunc(key, val, 'EX', dur);
  }

  async del (key) {
    const delAsyncFunc = promisify(this.client.del).bind(this.client);
    await delAsyncFunc(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
