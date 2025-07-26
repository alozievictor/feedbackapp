import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our base API URL with better fallback mechanism
const baseUrl = import.meta.env.VITE_API_URL || window.VITE_API_URL || 'http://localhost:5000/api';

console.log("API URL:", baseUrl); // Log the API URL to help with debugging

// Create our API service
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = getState().auth.token;
      
      // If we have a token, include it in the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      // Add CORS headers to support cross-origin requests
      headers.set('Access-Control-Allow-Origin', '*');
      
      return headers;
    },
    // Add better error handling
    responseHandler: async (response) => {
      if (!response.ok) {
        const error = await response.text();
        console.error("API Error:", response.status, error);
        return Promise.reject({ status: response.status, data: { message: error } });
      }
      return response.json();
    },
  }),
  tagTypes: ['Project', 'Feedback', 'User', 'File', 'Message'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    
    // User endpoints
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      transformResponse: (response) => {
        // Log the response for debugging
        console.log('Users API Response:', response);
        // If response is an object with a users property, return that, otherwise return response as is
        return response.users || response;
      },
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Project endpoints
    getAllProjects: builder.query({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...projectData }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: projectData,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),

    // File endpoints
    getFilesByProject: builder.query({
      query: (projectId) => `/files/project/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: 'File', id: projectId },
        'File',
      ],
    }),
    getFileById: builder.query({
      query: (fileId) => `/files/${fileId}`,
      providesTags: (result, error, fileId) => [
        { type: 'File', id: fileId },
        'File',
      ],
    }),
    uploadFile: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/files/project/${projectId}`,
        method: 'POST',
        body: formData,
        // Don't set Content-Type as FormData will set it with boundary
        formData: true,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'File', id: projectId },
        'File',
        'Project',
      ],
    }),
    deleteFile: builder.mutation({
      query: (fileId) => ({
        url: `/files/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['File', 'Project'],
    }),

    // Message endpoints
    getMessagesByProject: builder.query({
      query: (projectId) => `/messages/project/${projectId}`,
      providesTags: (result, error, projectId) => [
        ...(result ? result.map(({ _id }) => ({ type: 'Message', id: _id })) : []),
        { type: 'Message', id: 'LIST' },
        { type: 'Project', id: projectId }
      ],
    }),
    createMessage: builder.mutation({
      query: (formData) => ({
        url: '/messages',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, formData) => [
        { type: 'Message', id: 'LIST' },
        { type: 'Project', id: formData.get('projectId') }
      ],
    }),

    // Feedback endpoints
    getFeedbackByFile: builder.query({
      query: (fileId) => `/feedback/file/${fileId}`,
      providesTags: (result, error, fileId) => [
        { type: 'Feedback', id: fileId },
        'Feedback',
      ],
    }),
    createFeedback: builder.mutation({
      query: ({ fileId, ...feedbackData }) => ({
        url: `/feedback/file/${fileId}`,
        method: 'POST',
        body: feedbackData,
      }),
      invalidatesTags: (result, error, { fileId }) => [
        { type: 'Feedback', id: fileId },
        'Feedback',
        'File',
      ],
    }),
    updateFeedback: builder.mutation({
      query: ({ feedbackId, ...feedbackData }) => ({
        url: `/feedback/${feedbackId}`,
        method: 'PUT',
        body: feedbackData,
      }),
      invalidatesTags: ['Feedback', 'File'],
    }),
    deleteFeedback: builder.mutation({
      query: (feedbackId) => ({
        url: `/feedback/${feedbackId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feedback', 'File'],
    }),
    toggleResolveFeedback: builder.mutation({
      query: (feedbackId) => ({
        url: `/feedback/${feedbackId}/resolve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Feedback', 'File'],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  
  // User hooks
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  
  // Project hooks
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  
  // File hooks
  useGetFilesByProjectQuery,
  useGetFileByIdQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
  
  // Message hooks
  useGetMessagesByProjectQuery,
  useCreateMessageMutation,
  
  // Feedback hooks
  useGetFeedbackByFileQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
  useToggleResolveFeedbackMutation,
} = api;
