const API = "http://localhost:5000/api/tasks";

export const fetchTasks = async (token) => {
    const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};
