import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import courseApi from '../services/apiService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Typography, Card, CardContent, CircularProgress, Container } from '@mui/material';

const CourseDetails = () => {
  const { id } = useParams(); // Extract course ID from the URL
  const [courseData, setCourseData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await courseApi.getCourseById(id);
        setCourseData(response);
        
        // Check if the user is enrolled in the course
        setIsEnrolled(response.enrollments.some(enrollment => enrollment.course._id === id));
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!courseData) return <Typography variant="h6">Course not found.</Typography>;

  const enrollInCourse = async () => {
    try {
      const response = await courseApi.enrollCourse(id);
      alert('Enrollment successful!');
      setIsEnrolled(true); // Update the state after successful enrollment
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  return (
    <>
    <Navbar/>
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h4">{courseData.course.title}</Typography>
          <Typography variant="body1">{courseData.course.description}</Typography>
          <img src={courseData.course.thumbnail} alt={courseData.course.title} style={{ width: '100%', height: 'auto' }} />
          
          {/* Check enrollment status and show content accordingly */}
          {isEnrolled ? (
            <>
              <Typography variant="h5" gutterBottom>Course Content</Typography>
              {courseData.course.sections.map((section) => (
                <div key={section._id}>
                  <Typography variant="h6">{section.title}</Typography>
                  <Typography variant="body2">{section.description}</Typography>
                  <ul>
                    {section.lessons.map((lesson) => (
                      <li key={lesson._id}>
                        <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">{lesson.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>Free Lessons</Typography>
              {courseData.course.sections.map((section) => (
                <div key={section._id}>
                  <Typography variant="h6">{section.title}</Typography>
                  <ul>
                    {section.lessons.filter(lesson => lesson.price === 0).map((lesson) => (
                      <li key={lesson._id}>
                        <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">{lesson.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Button variant="contained" color="primary" onClick={enrollInCourse}>
                Enroll Now
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
    <Footer />
    </>
  );
};

export default CourseDetails;
