import {createClient} from 'redis';
import { promisify } from 'util'

class RedisClient{
    constructor() {
        this.client = createClient();
        this.client.on('error', (err) => console.log(err));
        this.connected = false;
        this.client.on('connect', () => {
            this.connected = true;
        }); 
    }

    isAlive(){
        return this.connected
    }

    async get(str){
        const getAsyncFun = promisify(this.client.get).bind(this.client)
        const value = await getAsyncFun(str);
        return value;
    }

    async set(str, val, dur){
        const setAsyncFun = promisify(this.client.set).bind(this.client)
        await setAsyncFun(str, val, 'EX', dur)
    }

    async del(str) {
        const delAsyncFun = promisify(this.client.del).bind(thi.client)
        await delAsyncFun(str);
    }

}

const redisClient = new RedisClient();

export default redisClient;
