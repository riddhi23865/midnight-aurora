
const form = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

// Fetch and display students
async function loadStudents() {
    try {
        const response = await fetch('/api/students');
        const students = await response.json();

        studentList.innerHTML = '';

        if (students.length === 0) {
            studentList.innerHTML = '<p>No students found.</p>';
            return;
        }

        students.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card';

            const details = document.createElement('p');
            details.textContent =
                `ID: ${student.id} | Name: ${student.name} | Course: ${student.course} | Year: ${student.year}`;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.onclick = () => editStudent(student);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteStudent(student.id);

            card.appendChild(details);
            card.appendChild(editBtn);
            card.appendChild(deleteBtn);

            studentList.appendChild(card);
        });

    } catch (error) {
        studentList.textContent = 'Unable to load students.';
    }
}

// Add or update student
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('studentId').value;

    const student = {
        name: document.getElementById('name').value.trim(),
        course: document.getElementById('course').value.trim(),
        year: document.getElementById('year').value
    };

    if (!student.name || !student.course || !student.year) {
        alert('Please fill all fields');
        return;
    }

    try {
        const url = id
            ? `/api/students/${id}`
            : '/api/students';

        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert(result.message);

        form.reset();
        document.getElementById('studentId').value = '';
        document.getElementById('submitBtn').textContent = 'Add Student';

        loadStudents();

    } catch (error) {
        alert('Server connection failed');
    }
});

// Edit student
function editStudent(student) {
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('course').value = student.course;
    document.getElementById('year').value = student.year;

    document.getElementById('submitBtn').textContent = 'Update Student';

    window.scrollTo(0, 0);
}

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert(result.message);
        loadStudents();

    } catch (error) {
        alert('Unable to delete student');
    }
}

// Load students when page opens
loadStudents();
