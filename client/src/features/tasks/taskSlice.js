import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks } from "./taskAPI";

export const getTasks = createAsyncThunk(
    "tasks/getTasks",
    async (_, { getState }) => {
        const token = getState().auth.token;
        return fetchTasks(token);
    }
);

const slice = createSlice({
    name: "tasks",
    initialState: { tasks: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTasks.fulfilled, (state, action) => {
            state.tasks = action.payload;
        });
    },
});

export default slice.reducer;
