$(document).ready(function () {
    loadFeaturedEvents();
});

function loadFeaturedEvents() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const grid = $("#featuredGrid");
    const empty = $("#featuredEmpty");

    if (events.length === 0) {
        empty.show();
        return;
    }

    empty.hide();
    grid.empty();

    const featured = events.slice(0, 3);

    featured.forEach(function (event) {
        const card = `
            <div class="featured-card">
                <div class="featured-top">
                    <span class="badge">${event.category}</span>
                    <span class="fee-tag">${event.fee}</span>
                </div>
                <h3>${event.title}</h3>
                <ul class="event-meta">
                    <li><span class="meta-icon">⏱</span> ${event.duration}</li>
                    <li><span class="meta-icon">📍</span> ${event.location || "Location TBD"}</li>
                    <li><span class="meta-icon">🎤</span> ${event.host || "Host TBD"}</li>
                </ul>
                <a href="ShoppingCart.html" class="btn-card">Add to Cart →</a>
            </div>
        `;
        grid.append(card);
    });

    if (events.length > 3) {
        grid.append(`
            <div class="featured-more">
                <p>+${events.length - 3} more event${events.length - 3 > 1 ? "s" : ""} available</p>
                <a href="Events.html" class="btn-secondary">See All Events</a>
            </div>
        `);
    }
}