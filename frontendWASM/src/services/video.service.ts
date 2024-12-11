import { VideoFilterType, VideoOperationType } from "../interfaces/video-process";
import { IVideo } from "../interfaces/video.interface";
import { decryptFile } from "../utils/aes";
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
        responseHandler: (response) => {
          if (response instanceof Response) {
            return response.blob();
          }
          throw new Error('Response is not an instance of Response');
        },
      }),
      transformResponse: async (encryptedBlob: Blob, meta) => {
        const ivBase64 = meta?.response?.headers.get('X-Encryption-IV');
        if (!ivBase64) {
          throw new Error('Missing IV in response headers');
        }
        return await decryptBlob(encryptedBlob, ivBase64);
      },
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
    processVideo: builder.mutation<Blob, { id: string; operationType: VideoOperationType; filterType?: VideoFilterType; startTime?: string; duration?: string }>({
      query: ({ id, operationType, filterType, startTime, duration }) => ({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        url: `/video/process/${id}`,
        method: "POST",
        body: { operationType, filterType, startTime, duration },
        responseHandler: (response) => response.blob(),
      }),
    }),
  })
});

async function decryptBlob(encryptedBlob: Blob, ivBase64: string): Promise<Blob> {

  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
  const encryptedData = new Uint8Array(await encryptedBlob.arrayBuffer());

  const decryptedData = await decryptFile(encryptedData, iv);

  if (!decryptedData) {
    throw new Error('Failed to decrypt file');
  }

  return new Blob([decryptedData], { type: encryptedBlob.type });
}