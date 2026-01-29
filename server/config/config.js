import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import dns from 'dns';

dotenv.config();

const isInternetConnected = async () => {
  return new Promise((resolve) => {
    dns.lookup('google.com', (err) => {
      resolve(!err);
    });
  });
};

const connectDb = async () => {
  try {
    const internet = await isInternetConnected();
    const uri = internet ? process.env.Cloud_MONGO_URI : process.env.Local_MONGO_URI;

    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const envUsed = internet ? 'Cloud (Online)' : 'Local (Offline)';
    console.log(`✔ MongoDB Connected to ${conn.connection.host} using ${envUsed}`.bgYellow.black);
  } catch (error) {
    console.log(`❌ Error : ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

export default connectDb;
