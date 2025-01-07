import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const fetchCourses = createAsyncThunk("courses/fetchCourses", async () => {
  const response = await axios.get("http://localhost:3001/api/courses");
  return response.data.courses; // Extract the 'courses' array
});

export const checkEnrollmentStatus = createAsyncThunk(
  'check-status/:courseId',
  async (courseId, { getState }) => {
    const state = getState();
    const token = localStorage.getItem('token');
    const userId = token ? jwtDecode(token).id : null;

    if (!userId) return { courseId, enrolled: false };

    try {
      const response = await axios.get(`http://localhost:3001/api/enrollment/${courseId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { courseId, enrolled: response.data.enrolled };
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      return { courseId, enrolled: false };
    }
  }
)

const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [], // Ensure it is an array
    status: "idle",
    error: null,
  },
  reducers: {
    // Reducer to update the enrollment status of a course
    updateEnrolledCourse: (state, action) => {
      const courseId = action.payload;
      state.courses = state.courses.map((course) =>
        course._id === courseId ? { ...course, isEnrolled: true } : course
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload; // Assign the extracted array
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateEnrolledCourse } = coursesSlice.actions;

export default coursesSlice.reducer;
