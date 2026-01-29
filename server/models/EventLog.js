import mongoose from "mongoose";


const eventLogSchema = new mongoose.Schema({
eventType: String,
taskId: mongoose.Schema.Types.ObjectId,
userId: mongoose.Schema.Types.ObjectId,
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("EventLog", eventLogSchema);