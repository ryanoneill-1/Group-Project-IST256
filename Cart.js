let events = JSON.parse(localStorage.getItem("events")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderEvents(list) {
    $("#eventList").empty();

    if (list.length === 0) {
        $("#eventList").html(`<div class="alert alert-warning">No events found.</div>`);
        return;
    }

    list.forEach((item) => {
        $("#eventList").append(`
            <div class="card p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4>${item.title}</h4>
                        <p class="mb-1"><strong>Category:</strong> ${item.category}</p>
                        <p class="mb-1"><strong>Length:</strong> ${item.duration}</p>
                        <p class="mb-1"><strong>Location:</strong> ${item.location || "—"}</p>
                        <p class="mb-0"><strong>Host:</strong> ${item.host || "—"}</p>
                    </div>
                    <div>
                        <button class="btn btn-primary mt-2" onclick="addToCart(${item.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `);
    });
}

function renderCart() {
    $("#cartItems").empty();

    if (cart.length === 0) {
        $("#cartItems").html("<p>Your cart is empty.</p>");
        return;
    }

    cart.forEach((item, index) => {
        $("#cartItems").append(`
            <div class="mb-3 border-bottom pb-2">
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>${item.title}</strong><br>
                        <span>${item.category}</span>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                        Remove
                    </button>
                </div>
            </div>
        `);
    });
}

function addToCart(id) {
    const selectedEvent = events.find(item => item.id === id);
    if (!selectedEvent) return;
    const alreadyInCart = cart.some(item => item.id === id);
    if (alreadyInCart) {
        alert("This event is already in your cart.");
        return;
    }

    cart.push(selectedEvent);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

$(document).ready(function () {
    renderEvents(events);
    renderCart();

    $("#search").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        let filtered = events.filter(item =>
            item.title.toLowerCase().includes(value) ||
            item.category.toLowerCase().includes(value) ||
            (item.location && item.location.toLowerCase().includes(value)) ||
            (item.host && item.host.toLowerCase().includes(value))
        );
        renderEvents(filtered);
    });
    $("#checkoutBtn").click(function () {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        alert("Registration submitted successfully!");
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    });
});