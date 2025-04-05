import mongoose from 'mongoose';
import { env } from './env.config';

const connectDB = async () => {
    try{
        await mongoose.connect(env.MONGO_URI as string);
        console.log('Connected')
    }catch(err){
        console.log('Not connected');
        process.exit(1);
    }  
}

export default connectDB;