import { api } from './api';

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
    uploadFile: builder.mutation({
      query: ({ projectId, file }) => {
        console.log('Creating FormData for file:', file.name);
        
        // Validate projectId
        if (!projectId) {
          throw new Error('Project ID is required');
        }
        
        // Create a proper FormData object
        const formData = new FormData();
        formData.append('file', file, file.name); // Include filename explicitly
        
        // Debug FormData content
        console.log('FormData file object:', file);
        
        // Don't log all entries as they might be binary and cause console issues
        console.log('FormData entries:', [...formData.entries()].map(e => e[0]));
        
        console.log('Uploading to:', `/files/project/${projectId}`);
        
        return {
          url: `/files/project/${projectId}`,
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - browser will set it with proper boundary
          formData: true,
        };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Project', id: projectId },
        'File',
      ],
    }),
    getProjectFiles: builder.query({
      query: (projectId) => `/projects/${projectId}/files`,
      providesTags: (result, error, projectId) => [
        ...result.map(({ id }) => ({ type: 'File', id })),
        { type: 'File', id: 'LIST' },
      ],
    }),
    addFeedback: builder.mutation({
      query: ({ projectId, fileId, feedback }) => ({
        url: `/projects/${projectId}/files/${fileId}/feedback`,
        method: 'POST',
        body: { feedback },
      }),
      invalidatesTags: (result, error, { projectId, fileId }) => [
        { type: 'File', id: fileId },
        { type: 'Project', id: projectId },
        'Feedback',
      ],
    }),
    getFeedback: builder.query({
      query: ({ projectId, fileId }) => `/projects/${projectId}/files/${fileId}/feedback`,
      providesTags: ['Feedback'],
    }),
    updateFeedbackStatus: builder.mutation({
      query: ({ projectId, fileId, feedbackId, status }) => ({
        url: `/projects/${projectId}/files/${fileId}/feedback/${feedbackId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Feedback', 'File', 'Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadFileMutation,
  useGetProjectFilesQuery,
  useAddFeedbackMutation,
  useGetFeedbackQuery,
  useUpdateFeedbackStatusMutation,
} = projectApi;
