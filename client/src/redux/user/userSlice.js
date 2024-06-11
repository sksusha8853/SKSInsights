import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

// Create a slice for user state management
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sign In actions
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update user actions
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Delete user actions
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    },
});

// Export actions
export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
