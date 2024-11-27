import mainApi from "./main.api";

const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ["Video"]
})

/*export const videoAPI = enchancedApi.injectEndpoints({
    /*uploadVideo: build.mutation<IUser, IRegister>({
        query: (dto) => ({
            url: '/auth/register',
            method: 'POST',
            body: dto
        }),
    }),
})*/