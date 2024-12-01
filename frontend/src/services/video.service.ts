import { IVideo } from "../interfaces/video.interface";
import mainApi from "./main.api";

const enchancedApi = mainApi.enhanceEndpoints({
  addTagTypes: ["Video"]
})

export const videoAPI = enchancedApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadVideo: builder.mutation<any, { formData: FormData; projectId: string }>({
      query: ({ formData, projectId }) => ({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        url: `/video/upload/${projectId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Video"],
    }),
    fetchVideoById: builder.query<Blob, string>({ // Повертаємо Blob
      query: (videoId) => ({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        url: `/video/${videoId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["Video"],
    }),
    fetchVideosByProject: builder.query<IVideo[], string>({
      query: (projectId) => ({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        url: `/video/project/${projectId}`,
        method: "GET",
      }),
      providesTags: ["Video"],
    }),
    deleteVideo: builder.mutation<void, string>({
      query: (videoId) => ({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        url: `/video/${videoId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video"],
    }),
  })
});