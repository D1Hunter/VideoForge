import { createSlice } from "@reduxjs/toolkit";

interface IProjectState {
    projects:IProjectState[];
}

const initialState: IProjectState  = {
    projects:[]
}

export const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
    }
})

export default projectSlice.reducer;