import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import courseApi from '../../services/apiService';

// Async thunk for creating a quiz
export const createQuiz = createAsyncThunk(
  'quiz/createQuiz',
  async ({ lessonId, quizData }, { rejectWithValue }) => {
    console.log('Thunk Received - Lesson ID:', lessonId);
    console.log('Thunk Received - Quiz Data:', quizData);
    
    try {
      const response = await courseApi.createQuiz(lessonId, quizData); // Updated to match courseApi method signature
      return response.data; // Assuming the API returns the created quiz data
    } catch (error) {
      console.error('Error creating quiz:', error.response || error.message);
      return rejectWithValue(error.response?.data || 'Failed to create quiz');
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    quizzes: [], // Stores quiz data
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.quizzes.push(action.payload); // Add the created quiz to the state
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create quiz';
        console.error('Quiz creation failed:', state.error);
      });
  },
});

export const { resetState } = quizSlice.actions;
export default quizSlice.reducer;
