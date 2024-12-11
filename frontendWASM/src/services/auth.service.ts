import { IUser } from "../interfaces/user.interface"
import { IRegister } from "../interfaces/register.interface"
import { ILogin } from "../interfaces/login.interface"
import mainApi from "./main.api"


const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ["Login"]
})

export const authAPI = enchancedApi.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation<IUser, IRegister>({
            query: (dto) => ({
                url: '/auth/register',
                method: 'POST',
                body: dto
            }),
        }),
        login: build.mutation<{ user:IUser,token: string }, ILogin>({
            query: (dto) => ({
                url: '/auth/login',
                method: 'POST',
                body: dto,
                credentials: "include"
            }),
        }),
        logout: build.mutation<string, null>({
            query: () => ({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                url: '/auth/logout',
                credentials: "include"
            })
        }),
        refresh: build.query<{ user:IUser,token: string }, null>({
            query: () => ({
                url: '/auth',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                credentials: "include"
            })
        })
    })
})