import { api } from './api';

export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
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

export const { 
  useGetFeedbackByFileQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
  useToggleResolveFeedbackMutation,
} = feedbackApi;
