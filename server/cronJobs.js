import cron from 'node-cron';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Step 1: Connect to local and cloud DB
const localDB = mongoose.createConnection(process.env.Local_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const cloudDB = mongoose.createConnection(process.env.Cloud_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Step 2: Load same schema for both connections
import tableSchema from './models/tableModel.js';
const LocalTable = localDB.model('Table', tableSchema.schema);
const CloudTable = cloudDB.model('Table', tableSchema.schema);

// Step 3: Define Sync Function
const syncLocalToCloud = async () => {
  try {
    const localData = await LocalTable.find();
    const cloudData = await CloudTable.find();

    const cloudIds = cloudData.map(item => item._id.toString());
    const newRecords = localData.filter(item => !cloudIds.includes(item._id.toString()));

    if (newRecords.length > 0) {
      await CloudTable.insertMany(newRecords);
      console.log(`✅ Synced ${newRecords.length} new table(s) from local to cloud`);
    } else {
      console.log(`✅ No new table data to sync`);
    }
  } catch (error) {
    console.error('❌ Sync error:', error);
  }
};

// Schedule to run every hour
cron.schedule('0 * * * *', syncLocalToCloud); // every hour

export default cron;
