import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const InstructorDashboard = React.lazy(() => import("./pages/Instructor/InstructorDashboard"));
const AdminDashboard = React.lazy(() => import("./pages/Admin/AdminDashboard"))
const ManageCourses = React.lazy(() => import("./pages/Instructor/ManageCourse"))
const StudentCourses = React.lazy(() => import("./pages/Student/MyCourses"));
const CourseForm = React.lazy(() => import("./pages/Instructor/CourseForm"));
const LessonForm = React.lazy(() => import("./pages/Instructor/LessonForm"));
const QuizCreationForm = React.lazy(() => import("./pages/Instructor/QuizCreationForm"));
const CourseListing = React.lazy(() => import("./pages/CourseListing"));
const CourseDetails = React.lazy(() => import("./pages/CourseDetails"));
const CourseMaterialsPage = React.lazy(() => import("./pages/CourseMaterialPage"));
const Quiz = React.lazy(() => import("./components/Quiz/Quiz"));
const Payment = React.lazy(() => import("./pages/Payment/Payment")); 

const App = () => (
  <Router>
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><CircularProgress/></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<CourseListing />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course/:id/Material" element={<CourseMaterialsPage/>}/>
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/ManageCourses/:courseId" element={<ManageCourses />} />
        <Route path="/Student/MyCourses" element={<StudentCourses />}/>
        <Route path="/instructor/course/new" element={<CourseForm />}/>
        <Route path="/instructor/lesson/new" element={<LessonForm />}/>
        <Route path="/Admin" element={<AdminDashboard />}/>
        <Route path="/payment" element={<Payment />}/>
        <Route path="/quiz/create/new" element={<QuizCreationForm />}/>
        <Route path="/quiz" element={<Quiz />}/>
      </Routes>
    </Suspense>
  </Router>
);

export default App;