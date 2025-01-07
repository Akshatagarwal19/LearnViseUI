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
      .find((row) => row.startsWith('token='))
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

  addSection: async (courseId, sectionData) => {
    const response = await axiosInstance.post(`/courses/${courseId}/sections`, sectionData);
    return response;
  },

  addLesson: async (courseId, sectionId, lessonData) => {
    const response = await axiosInstance.post(`/courses/${courseId}/sections/${sectionId}/lessons`, lessonData);
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

  enrollCourse: async (courseId) => {
    try {
      const response = await axiosInstance.post(`/enrollment/enroll/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error enrolling in course", error.response?.data || error.message);
      throw new Error("Failed ti enroll in coursr");
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
      const response = await axiosInstance.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error.response?.data || error.message);
      throw new Error('Failed to fetch course');
    }
  },
  
};

export default courseApi;
