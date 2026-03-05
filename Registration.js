let students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;

function validateForm() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const org       = document.getElementById("org").value.trim();
    const email     = document.getElementById("email").value.trim();

    if (firstName === "") {
        alert("Please enter a first name.");
        return false;
    }
    if (lastName === "") {
        alert("Please enter a last name.");
        return false;
    }
    if (org === "") {
        alert("Please enter an organization.");
        return false;
    }
    if (email === "" || !email.endsWith("@psu.edu")) {
        alert("Please enter a valid PSU email (abc123@psu.edu).");
        return false;
    }

    return true;
}

function saveStudent() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const org       = document.getElementById("org").value.trim();
    const grade     = document.getElementById("grade").value;
    const email     = document.getElementById("email").value.trim();
    const phone     = document.getElementById("phone").value.trim();

    if (editingId !== null) {
        const index = students.findIndex(s => s.id === editingId);
        students[index] = { id: editingId, firstName, lastName, org, grade, email, phone };
        editingId = null;
    } else {
        const newStudent = {
            id: Date.now(),
            firstName,
            lastName,
            org,
            grade,
            email,
            phone
        };
        students.push(newStudent);
    }

    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    document.getElementById("registrationForm").reset();
}

function gradeLabel(value) {
    const labels = {
        yearOne:   "1st Year",
        yearTwo:   "2nd Year",
        yearThree: "3rd Year",
        yearFour:  "4th Year",
        yearPlus:  "5+ Year"
    };
    return labels[value] || value;
}

function displayStudents() {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7'>No students registered yet.</td></tr>";
        return;
    }

    students.forEach(function(student) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.org}</td>
            <td>${gradeLabel(student.grade)}</td>
            <td>${student.email}</td>
            <td>${student.phone || "N/A"}</td>
            <td>
                <button onclick="editStudent(${student.id})">Edit</button>
                <button onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    document.getElementById("firstName").value = student.firstName;
    document.getElementById("lastName").value  = student.lastName;
    document.getElementById("org").value        = student.org;
    document.getElementById("grade").value      = student.grade;
    document.getElementById("email").value      = student.email;
    document.getElementById("phone").value      = student.phone;

    editingId = id;
    window.scrollTo(0, 0);
}

function deleteStudent(id) {
    const confirmed = confirm("Are you sure you want to remove this student?");
    if (!confirmed) return;

    students = students.filter(s => s.id !== id);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

document.getElementById("registrationForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if (validateForm()) {
        saveStudent();
    }
});

displayStudents();