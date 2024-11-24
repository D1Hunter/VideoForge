import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/user.interface";

interface IUserState {
    user:IUser
    isAuth: boolean
}

const initialState: IUserState = {
    user:
    {
        id: '',
        email: ''
    },
    isAuth: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{id:string,email:string}>) => {
            state.user.id = action.payload.id
            state.user.email = action.payload.email
            state.isAuth = true
        }
    }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;