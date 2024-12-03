import { IVideo, VideoFilterType } from "../interfaces/video.interface";
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
    fetchVideoById: builder.query({
      query: (id) => ({
        url: `video/${id}`,
        method: 'GET',
        headers: {
          Range: 'bytes=0-',
        },
        responseHandler: (response) => response.blob(),
      }),
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
    processVideo: builder.mutation<Blob, { id: string; type: VideoFilterType; startTime?: string; duration?: string }>({
      query: ({ id, type, startTime, duration }) => ({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
        url: `/video/process/${id}`,
        method: "POST",
        body: { type, startTime, duration },
        responseHandler: (response) => response.blob(),
      }),
    }),
  })
});