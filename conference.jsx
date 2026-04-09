import React, { useEffect, useMemo, useState } from "react";

const sampleEvents = [
  {
    id: 1,
    title: "Leadership Workshop",
    category: "Workshop",
    duration: "2 hours",
    location: "Student Center Room 101",
    host: "Business Club",
  },
  {
    id: 2,
    title: "Robotics Demo Night",
    category: "Technology",
    duration: "1.5 hours",
    location: "Engineering Lab",
    host: "Robotics Club",
  },
  {
    id: 3,
    title: "Spring Networking Mixer",
    category: "Social",
    duration: "3 hours",
    location: "Main Hall",
    host: "Career Society",
  },
];

const navItems = [
  "Homepage",
  "Student Registration",
  "Club Events",
  "Shopping Cart",
  "Storefront",
  "Session Registration",
];

export default function StudentClubPortalCart() {
  const [events, setEvents] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    const storedCart = localStorage.getItem("cart");

    const parsedEvents = storedEvents ? JSON.parse(storedEvents) : sampleEvents;
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    setEvents(parsedEvents);
    setCart(parsedCart);

    if (!storedEvents) {
      localStorage.setItem("events", JSON.stringify(sampleEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredEvents = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return events;

    return events.filter((item) =>
      [item.title, item.category, item.location, item.host]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
  }, [events, search]);

  const addToCart = (id) => {
    const selectedEvent = events.find((item) => item.id === id);
    if (!selectedEvent) return;

    const alreadyInCart = cart.some((item) => item.id === id);
    if (alreadyInCart) {
      setMessage("This event is already in your cart.");
      return;
    }

    setCart((prev) => [...prev, selectedEvent]);
    setMessage(`Added "${selectedEvent.title}" to your cart.`);
  };

  const removeFromCart = (indexToRemove) => {
    const removedItem = cart[indexToRemove];
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (removedItem) {
      setMessage(`Removed "${removedItem.title}" from your cart.`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: email format check
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // NEW: detailed validation
  const validateForm = () => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!isValidEmail(form.email)) return "Please enter a valid email address.";
    return null;
  };

  const isFormValid = () => {
    return validateForm() === null;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setCart([]);
    setForm({ firstName: "", lastName: "", phone: "", email: "" });
    setMessage("Registration submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="bg-slate-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3">
          {navItems.map((item) => {
            const isActive = item === "Shopping Cart";
            return (
              <button
                key={item}
                type="button"
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600 font-semibold"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Student Club Portal
          </h1>
          <p className="mt-2 text-slate-600">
            Browse events and add them to your registration cart.
          </p>
        </header>

        {message && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <h2 className="mb-3 text-2xl font-semibold">Browse Events</h2>

            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <label htmlFor="search" className="mb-2 block text-sm font-semibold">
                Search Events
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search events..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
              />
            </div>

            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
                  No events found.
                </div>
              ) : (
                filteredEvents.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate-700">
                          <span className="font-semibold">Category:</span> {item.category}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold">Length:</span> {item.duration}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold">Location:</span> {item.location || "—"}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold">Host:</span> {item.host || "—"}
                        </p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => addToCart(item.id)}
                          className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="lg:col-span-5 space-y-6">

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="bg-blue-600 px-5 py-4 text-white">
                <h2 className="text-2xl font-semibold">Your Cart</h2>
              </div>

              <div className="p-5">
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-slate-600">Your cart is empty.</p>
                  ) : (
                    cart.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4"
                      >
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-slate-600">{item.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="rounded-xl bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || !isFormValid()}
                  className={`mt-6 w-full rounded-xl px-4 py-3 font-semibold text-white transition ${
                    cart.length === 0 || !isFormValid()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm font-semibold text-slate-600">
          © 2026 Student Club Portal. IST256 Group Project.
        </div>
      </footer>
    </div>
  );
}
