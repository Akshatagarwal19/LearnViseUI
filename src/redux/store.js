import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/coursesSlice';
import userReducer from './slices/userSlice';
import quizReducer from './slices/quizSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    user: userReducer,
    quiz: quizReducer,
  },
});

export default store;