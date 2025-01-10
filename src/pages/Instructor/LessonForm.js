import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import courseApi from "../../services/apiService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const LessonForm = ({ courseId: propCourseId, sectionId: propSectionId }) => {
  const [searchParams] = useSearchParams();
  const courseId = propCourseId || searchParams.get("courseId");
  const sectionId = propSectionId || searchParams.get("sectionId");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    video: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, video: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.price) formData.append("price", parseFloat(form.price)); // Ensure price is sent as a number
    if (form.video) formData.append("video", form.video);

    try {
      const response = await courseApi.addLesson(courseId, sectionId, formData); // Ensure courseId and sectionId are passed
      const lessonId = response.data?.lesson?.id;

      setSuccess("Lesson created successfully!");
      console.log("Response:", response.data);

      // Clear form fields after successful submission
      setForm({ title: "", description: "", price: "", video: null });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson");
    }
  };

  const handleAddNewSection = () => {
    navigate(`/instructor/section/new?courseId=${courseId}`);
  };

  return (
    <>
      <Navbar />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create a New Lesson
        </Typography>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />
        <Button variant="outlined" component="label">
          Upload Video
          <input type="file" accept="video/*" hidden onChange={handleFileChange} />
        </Button>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <Button variant="contained" type="submit">
          Submit
        </Button>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button variant="outlined" onClick={handleAddNewSection}>
            Add New Section
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default LessonForm;
