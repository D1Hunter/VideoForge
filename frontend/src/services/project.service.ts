import { IProject } from "../interfaces/project.interface";
import mainApi from "./main.api";

const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ["Project"]
})

export const projectAPI = enchancedApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchProjects: builder.query<IProject[], null>({
            query: () => ({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                url:"/project/user"
            }),
            providesTags: ["Project"],
        }),
        fetchProject:builder.query<IProject, string>({
            query: (id:string) => ({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                url:`/project/${id}`
            }),
            providesTags: ["Project"],
        }),
        addProject: builder.mutation({
            query: (newProject) => ({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                url: "/project",
                method: "POST",
                body: newProject,
            }),
            invalidatesTags: ["Project"],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...updateData }) => ({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                url: `/project/${id}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: ["Project"],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                url: `/project/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"],
        }),
    }),
})