import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { AppState } from '..';

export interface State {
    access_token: string | any,
    refresh_token: string | any,
    isAuthenticated : boolean
}

export interface Action {    
}

const initialState: State = {
    access_token: '',
    refresh_token: '',
    isAuthenticated : false
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        loginUser: (state, action: PayloadAction<State>) => {
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isAuthenticated = action.payload.isAuthenticated;
      },
      logoutUser: (state) => {
        state.access_token = '';
        state.refresh_token = '';
        state.isAuthenticated = false;
      },
    },
})
  
export const { loginUser, logoutUser } = authSlice.actions

export const selectAuth = (state: AppState) => state.auth

export default authSlice.reducer

export const persistConfigAuth = {
    key : 'authRootLevel3Deliberation',
    version: 1,
    storage
}