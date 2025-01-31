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

  getStudents: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/students`);
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  getInstructors: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/instructors`);
      return response.data;
    } catch (error) {
      console.error("Error fetching instructors:", error);
      throw error;
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
      const response = await axiosInstance.delete(`/courses/${courseId}/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lesson:', error.response?.data || error.message);
      throw new Error('Failed to delete lesson');
    }
  },

  // isfreestatus api
  updateLessonStatus: async (courseId, lessonId, isFree) => {
    try {
      const response = await axiosInstance.patch(`http://localhost:3001/api/courses/${courseId}/lessons/${lessonId}`,{isFree});
      return response.data;
    } catch (error) {
      console.error('Error updating Lesson status:', error.response?.data || error.message);
      throw new Error('Failed to update lesson status');
    }
  },

  createQuiz: async ({ lessonId, quizData }) => {
    console.log('Lesson ID:', lessonId);
    console.log('Quiz Data:', quizData);
  
    try {
      const response = await axiosInstance.post(`/Quiz/lessons/${lessonId}/quiz`, quizData);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error.message);
      throw new Error('Failed to create quiz');
    }
  },

  markLessonCompleted: async (courseId, lessonId, payload) => {
    try {
        const response = await axiosInstance.post(`/progress/${courseId}/lessons/${lessonId}/complete`, payload);
        return response.data;
    } catch (error) {
        console.error("Error marking lesson as completed:", error.response?.data || error.message);
        throw new Error("Failed to mark lesson as completed");
    }
  },

  getCourseProgress: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/progress/${courseId}/progress`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course progress:", error.response?.data || error.message);
      throw new Error("Failed to get Course Progress");
    }
  },

  generateCertificate: async (courseId) => {
    try {
        const response = await axiosInstance.post(`/certificate/${courseId}/generate`);
        return response.data;
    } catch (error) {
        console.error("Error generating certificate:", error.response?.data || error.message);
        throw new Error("Failed to generate Certificate");
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

  getEnrollments: async () => {
    try {
      const response = await axiosInstance.get('/enrollment');
      return response.data.enrollments;
    } catch (error) {
      console.error('Error fetching enrollments:', error.response?.data || error.message);
      throw new Error('Failed to fetch enrollments');
    }
  },

  

};

export default courseApi;
