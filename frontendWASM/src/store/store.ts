import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user-slice";
import mainApi from "../services/main.api";

export const store = configureStore({
    reducer: {
        userReducer,
        [mainApi.reducerPath]:mainApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mainApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch