import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
