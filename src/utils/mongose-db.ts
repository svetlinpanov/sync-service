import { connect, disconnect } from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

export class Storage {
    private isConnected = false;

    public async connectToDB()  {
        const mongo = await connect( process.env.DB_URL, {
            dbName: "sync",
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        if(mongo.connections[0].readyState === 1) {
            this.isConnected = mongo.connections[0].readyState === 1;
        } else {
            throw new Error('DB connection failed');
        }
    }

    public async disconnectFromDB() {
        await disconnect();
        this.isConnected = false;
    }

    public checkConnection(): boolean {
        return this.isConnected;
    }

}