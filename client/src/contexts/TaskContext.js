import React, { createContext, useContext, useState, useMemo } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const value = useMemo(() => ({ tasks, setTasks }), [tasks]);

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Hook
export const useTasks = () => useContext(TaskContext);
