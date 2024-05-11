import mongodb from 'mongodb';
import {MongoClient} from 'mongodb';

class DBClient{
    constructor(){
        this.host = (process.env.DB_HOST) ? process.env.DB_HOST : 'localhost';
        this.port = (process.env.DB_PORT) ? process.env.DB_PORT : 27017;
        this.database = (process.env.DB_DATABASE) ? process.env.DB_DATABASE : 'files_manager';
        const url = `mongodb://${this.host}:${this.port}/${this.database}`;
        this.connected = false;
        this.client = new MongoClient(url, {useUnifiedTopology: true});
        this.client.connect().then(() => {
            this.connected = true;
        }).catch((err) => console.log(err));
    }

    isAlive(){
        return this.connected;
    }
    
    // return the number of documents in users collection
    async nbUsers(){
        await this.client.connect();
        const collectUsers = this.client.db(this.database).collection('users').countDocuments();
        return collectUsers;
    }
    
    // return the number of documents in the files collection
    async nbFiles(){
        await this.client.connect();
        const collectFiles = this.client.db(this.database).collection('files').countDocuments();
        return collectFiles;
    }
}

const dbClient = new DBClient();
export default dbClient;
