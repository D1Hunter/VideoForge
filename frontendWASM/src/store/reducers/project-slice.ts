import { createSlice } from "@reduxjs/toolkit";
import { IProject } from "../../interfaces/project.interface";

interface IProjectState {
    projects:IProject[];
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