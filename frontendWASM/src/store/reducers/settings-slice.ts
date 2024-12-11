import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettingsState {
    useMutlithread:boolean;
}

const initialState: ISettingsState = {
    useMutlithread:false
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setUseMultithread: (state, action: PayloadAction<boolean>) => {
            state.useMutlithread = action.payload
        },
    }
})

export default settingsSlice.reducer;
export const { setUseMultithread } = settingsSlice.actions;