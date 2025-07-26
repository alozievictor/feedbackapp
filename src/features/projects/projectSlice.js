import { createSlice } from '@reduxjs/toolkit';
import { projectApi } from '../../services/project.service';

const initialState = {
  currentProject: null,
  currentFile: null,
  isLoading: false,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.currentFile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        projectApi.endpoints.getProject.matchPending,
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        projectApi.endpoints.getProject.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.currentProject = payload;
        }
      )
      .addMatcher(
        projectApi.endpoints.getProject.matchRejected,
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { setCurrentProject, setCurrentFile, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
