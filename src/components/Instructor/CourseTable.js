import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const CourseTable = ({ courses }) => {
    const handleEdit = (id) => {
        window.location.href = `/instructor/course/${id}/edit`;
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            console.log(`Course with ID ${id} deleted.`);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Students</TableCell>
                        <TableCell align="centre">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell>{course.title}</TableCell>
                            <TableCell>{course.category}</TableCell>
                            <TableCell>{course.price}</TableCell>
                            <TableCell>{course.students}</TableCell>
                            <TableCell align="centre">
                                <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(course.id)} sx={{mr: 1 }}>
                                    Edit
                                </Button>
                                <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(course.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CourseTable;