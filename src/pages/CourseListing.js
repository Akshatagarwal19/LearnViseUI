import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CourseListing = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    // Mocked data
    const mockCourses = [
      {
        id: 1,
        title: "React Basics",
        description: "Learn the basics of React.",
        image: "/path-to-placeholder-image1.png",
      },
      {
        id: 2,
        title: "Advanced React",
        description: "Dive deeper into React concepts.",
        image: "/path-to-placeholder-image2.png",
      },
      {
        id: 3,
        title: "JavaScript Essentials",
        description: "Master JavaScript for web development.",
        image: "/path-to-placeholder-image3.png",
      },
    ];
    setCourses(mockCourses);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    
    <div>
      <Navbar />
      <h1>Courses</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {courses.map((course) => (
          <div key={course.id} style={{ border: "1px solid #ccc", padding: "16px" }}>
            <img src={course.image} alt={course.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default CourseListing;
