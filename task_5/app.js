
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Temporary student data
let students = [
    { id: 1, name: "Rahul", course: "B.Tech CSE", year: "2nd Year" },
    { id: 2, name: "Priya", course: "B.Tech IT", year: "3rd Year" },
    { id: 3, name: "Aman", course: "BCA", year: "1st Year" }
];

let nextId = 4;

// 1. READ - Get all students
app.get('/api/students', (req, res) => {
    res.json(students);
});

// 2. CREATE - Add a new student
app.post('/api/students', (req, res) => {
    const { name, course, year } = req.body;

    if (!name || !course || !year) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newStudent = {
        id: nextId++,
        name,
        course,
        year
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// 3. UPDATE - Update student details
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, course, year } = req.body;

    if (!name || !course || !year) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    student.name = name;
    student.course = course;
    student.year = year;

    res.json({
        message: "Student updated successfully",
        student
    });
});

// 4. DELETE - Delete a student
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.json({
        message: "Student deleted successfully"
    });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
