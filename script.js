let students = JSON.parse(localStorage.getItem("students")) || [];

// Form
const studentForm = document.getElementById("studentForm");

// Table
const studentTableBody = document.getElementById("studentTableBody");

// Search
const searchInput = document.getElementById("search");

// Statistics
const totalStudents = document.getElementById("totalStudents");
const averageMarks = document.getElementById("averageMarks");
const passedStudents = document.getElementById("passedStudents");


// Add Student
studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const course = document.getElementById("course").value.trim();
    const marks = Number(document.getElementById("marks").value);

    if (marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100.");
        return;
    }

    const existingStudent = students.find(
        student => student.roll.toLowerCase() === roll.toLowerCase()
    );

    if (existingStudent) {
        alert("Roll number already exists.");
        return;
    }

    const student = {
        id: Date.now(),
        name: name,
        roll: roll,
        course: course,
        marks: marks
    };

    students.push(student);

    saveStudents();
    displayStudents();
    updateStatistics();

    studentForm.reset();

    alert("Student added successfully!");
});


// Calculate Grade
function getGrade(marks) {

    if (marks >= 90) {
        return "A+";
    } else if (marks >= 80) {
        return "A";
    } else if (marks >= 70) {
        return "B";
    } else if (marks >= 60) {
        return "C";
    } else if (marks >= 50) {
        return "D";
    } else {
        return "F";
    }
}


// Display Students
function displayStudents(searchTerm = "") {

    studentTableBody.innerHTML = "";

    const filteredStudents = students.filter(student => {

        const search = searchTerm.toLowerCase();

        return (
            student.name.toLowerCase().includes(search) ||
            student.roll.toLowerCase().includes(search) ||
            student.course.toLowerCase().includes(search)
        );
    });

    const emptyMessage = document.getElementById("emptyMessage");

    if (filteredStudents.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    filteredStudents.forEach((student, index) => {

        const row = document.createElement("tr");

        const grade = getGrade(student.marks);
        const status = student.marks >= 40 ? "Pass" : "Fail";

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
            <td>${grade}</td>
            <td class="${status === "Pass" ? "pass" : "fail"}">
                ${status}
            </td>
            <td>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });
}


// Delete Student
function deleteStudent(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmation) {
        return;
    }

    students = students.filter(student => student.id !== id);

    saveStudents();
    displayStudents(searchInput.value);
    updateStatistics();
}


// Search Student
searchInput.addEventListener("input", function () {

    displayStudents(searchInput.value);

});


// Update Statistics
function updateStatistics() {

    const total = students.length;

    totalStudents.textContent = total;

    if (total === 0) {
        averageMarks.textContent = "0";
    } else {

        const sum = students.reduce(
            (total, student) => total + student.marks,
            0
        );

        const average = sum / total;

        averageMarks.textContent = average.toFixed(2);
    }

    const passed = students.filter(
        student => student.marks >= 40
    ).length;

    passedStudents.textContent = passed;
}


// Save Data
function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// Initial Display
displayStudents();
updateStatistics();
