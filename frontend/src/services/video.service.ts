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
        fetchVideos: builder.query<any[], void>({
          query: () => "/videos",
          providesTags: ["Video"],
        }),
      }),
})