import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URL = 'http://localhost:8080'

const mainApi = createApi({
    reducerPath:'mainApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    endpoints: () => ({}),
});

export default mainApi;