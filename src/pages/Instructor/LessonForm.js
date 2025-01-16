import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import courseApi from "../../services/apiService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const LessonForm = ({ courseId: propCourseId }) => {
  const [searchParams] = useSearchParams();
  const courseId = propCourseId || searchParams.get("courseId");

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    file: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ 
        ...form, 
        file,
        contentType: file.type.startsWith("video/")
          ? "video"
          : file.type.includes("pdf")
          ? "pdf"
          : file.type.includes("excel") || file.type.includes("spreadsheet")
          ? "excel"
          : "unknown",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("duration", form.duration);
    if (form.file) formData.append("file", form.file);
    if (form.contentType) formData.append("contentType", form.contentType);

    try {
      const response = await courseApi.addLesson(courseId, formData);
      setSuccess("Lesson created successfully!");
      console.log("Response:", response.data);

      // Clear form fields after successful submission
      setForm({ title: "", description: "", duration: "", file: null });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson");
    }
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
          label="Duration (HH:MM:SS)"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          required
        />
        <Button variant="outlined" component="label">
          Upload File
          <input
            type="file"
            accept="video/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {form.file && (
          <Typography variant="body2" color="textSecondary">
            Selected File: {form.file.name}
          </Typography>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default LessonForm;
