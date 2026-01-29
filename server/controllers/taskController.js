import Task from "../models/task.js";
import EventLog from "../models/EventLog.js";
import { io } from "../server.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id,
    });

    await EventLog.create({
      eventType: "TASK_CREATED",
      taskId: task._id,
      userId: req.user.id,
    });

    io.emit("taskCreated", task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    );

    await EventLog.create({
      eventType: "TASK_ASSIGNED",
      taskId: task._id,
      userId: req.body.userId,
    });

    io.emit("taskAssigned", task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
