let events = JSON.parse(localStorage.getItem("events")) || [];
let editingId = null;

function validateForm() {
    const title    = document.getElementById("eventTitle").value.trim();
    const category = document.getElementById("eventCategory").value;
    const duration = document.getElementById("eventDuration").value.trim();
    const fee      = document.getElementById("eventFee").value;

    hideMessages();

    if (title === "") {
        showError("Event Title is required.");
        return false;
    }
    if (category === "") {
        showError("Please select a Category.");
        return false;
    }
    if (duration === "") {
        showError("Event Length is required.");
        return false;
    }
    if (fee === "") {
        showError("Please select a Registration Fee.");
        return false;
    }
    return true;
}

function saveEvent() {
    if (!validateForm()) return;

    const title    = document.getElementById("eventTitle").value.trim();
    const category = document.getElementById("eventCategory").value;
    const duration = document.getElementById("eventDuration").value.trim();
    const fee      = document.getElementById("eventFee").value;
    const location = document.getElementById("eventLocation").value.trim();
    const host     = document.getElementById("eventHost").value.trim();

    if (editingId !== null) {
        const index = events.findIndex(e => e.id === editingId);
        events[index] = { id: editingId, title, category, duration, fee, location, host };
        editingId = null;
        showSuccess("Event updated successfully!");
        document.getElementById("formTitle").textContent = "Add New Event";
        document.getElementById("submitBtn").textContent = "Add Event";
        document.getElementById("cancelBtn").style.display = "none";
        document.getElementById("eventId").value = "";
    } else {
        const newEvent = {
            id: Date.now(),
            title,
            category,
            duration,
            fee,
            location,
            host
        };
        events.push(newEvent);
        showSuccess("Event added successfully!");
    }

    localStorage.setItem("events", JSON.stringify(events));
    resetForm();
    displayEvents(events);
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById("eventId").value       = event.id;
    document.getElementById("eventTitle").value    = event.title;
    document.getElementById("eventCategory").value = event.category;
    document.getElementById("eventDuration").value = event.duration;
    document.getElementById("eventFee").value      = event.fee;
    document.getElementById("eventLocation").value = event.location;
    document.getElementById("eventHost").value     = event.host;

    editingId = id;
    document.getElementById("formTitle").textContent = "Edit Event";
    document.getElementById("submitBtn").textContent = "Update Event";
    document.getElementById("cancelBtn").style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
    editingId = null;
    resetForm();
    document.getElementById("formTitle").textContent = "Add New Event";
    document.getElementById("submitBtn").textContent = "Add Event";
    document.getElementById("cancelBtn").style.display = "none";
    document.getElementById("eventId").value = "";
    hideMessages();
}

function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    events = events.filter(e => e.id !== id);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents(events);
}

function displayEvents(list) {
    const tbody = document.getElementById("eventsTableBody");
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = "<tr><td colspan='8' class='empty-msg'>No events found.</td></tr>";
        return;
    }

    list.forEach(function(event) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="ID">${event.id}</td>
            <td data-label="Title"><strong>${event.title}</strong></td>
            <td data-label="Category"><span class="badge">${event.category}</span></td>
            <td data-label="Length">${event.duration}</td>
            <td data-label="Fee">${event.fee}</td>
            <td data-label="Location">${event.location || "—"}</td>
            <td data-label="Host">${event.host || "—"}</td>
            <td data-label="Actions" class="actions-cell">
                <button class="btn-edit" onclick="editEvent(${event.id})">Edit</button>
                <button class="btn-delete" onclick="deleteEvent(${event.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

$(document).ready(function () {
    $("#searchInput").on("input", function () {
        const query = $(this).val().toLowerCase().trim();
        if (query === "") {
            displayEvents(events);
            return;
        }
        const filtered = events.filter(function (e) {
            return e.title.toLowerCase().includes(query) ||
                   e.category.toLowerCase().includes(query);
        });
        displayEvents(filtered);
    });
});

function resetForm() {
    document.getElementById("eventTitle").value    = "";
    document.getElementById("eventCategory").value = "";
    document.getElementById("eventDuration").value = "";
    document.getElementById("eventFee").value      = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventHost").value     = "";
}

function showError(msg) {
    const el = document.getElementById("formError");
    el.textContent = msg;
    el.style.display = "block";
    document.getElementById("formSuccess").style.display = "none";
}

function showSuccess(msg) {
    const el = document.getElementById("formSuccess");
    el.textContent = msg;
    el.style.display = "block";
    document.getElementById("formError").style.display = "none";
    setTimeout(() => { el.style.display = "none"; }, 3000);
}

function hideMessages() {
    document.getElementById("formError").style.display   = "none";
    document.getElementById("formSuccess").style.display = "none";
}

displayEvents(events);