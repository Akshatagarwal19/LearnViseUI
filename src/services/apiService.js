import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];
    console.log('Retrieved Token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.warn('Unauthorized - Redirecting to login...');
    }

    return Promise.reject(error);
  }
);

const courseApi = {
  createCourse: async (courseData) => {
    const response = await axiosInstance.post('/courses', courseData);
    return response;
  },

  addLesson: async (courseId, lessonData) => {
    const response = await axiosInstance.post(`/courses/${courseId}/lessons`, lessonData);
    return response;
  },

  getAllCourses: async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/courses");
      return response.data.courses;  // Return only the courses part of the response
    } catch (err) {
      throw new Error("Failed to fetch courses: " + err.message);
    }
  },

  getEnrolledCourses: async () => {
    try {
      const response = await axiosInstance.get('http://localhost:3001/api/enrollment/details');
      return response.data.enrollments;
    } catch (error) {
      console.error("Error fetching enrolled courses:", error.response?.data || error.message);
      throw new Error("Failed to fetch enrolled courses: " + error.message);
    }
  },

  checkEnrollmentStatus: async (courseId) => {
    try {
      const response = await axiosInstance.get(`http://localhost:3001/api/enrollment/check-status/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      throw error;
    }
  },

  enrollCourse: async (courseId) => {
    try {
      const response = await axiosInstance.post(`/enrollment/enroll/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error enrolling in course", error.response?.data || error.message);
      throw new Error("Failed to enroll in course");
    }
  },

  getEnrollments: async () => {
    try {
      const response = await axiosInstance.get('/enrollment');
      return response.data.enrollments;
    } catch (error) {
      console.error('Error fetching enrollments:', error.response?.data || error.message);
      throw new Error('Failed to fetch enrollments');
    }
  },

  getCourseById: async (courseId) => {
    try {
      const response = await axiosInstance.get(`http://localhost:3001/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error.response?.data || error.message);
      throw new Error('Failed to fetch course');
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const response = await axiosInstance.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error.response?.data || error.message);
      throw new Error('Failed to update course');
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error.response?.data || error.message);
      throw new Error('Failed to delete course');
    }
  },

  updateLesson: async (courseId, sectionId, lessonId, lessonData) => {
    try {
      const response = await axiosInstance.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error.response?.data || error.message);
      throw new Error('Failed to update lesson');
    }
  },

  deleteLesson: async (courseId, sectionId, lessonId) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lesson:', error.response?.data || error.message);
      throw new Error('Failed to delete lesson');
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout'); // Adjust endpoint as needed
      return response;
    } catch (error) {
      console.error('Error during logout:', error.response?.data || error.message);
      throw new Error('Failed to log out');
    }
  },

  updateLessonStatus: async (courseId, sectionId, lessonId, isFree) => {
    try {
      const response = await axiosInstance.patch(`http://localhost:3001/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,{isFree});
      return response.data;
    } catch (error) {
      console.error('Error updating Lesson status:', error.response?.data || error.message);
      throw new Error('Failed to update lesson status');
    }
  },
};

export default courseApi;
