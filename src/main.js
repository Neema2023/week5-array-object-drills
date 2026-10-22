
import { orders } from "../data.js";
import "./style.css";

// Calculate the total price of an order
function orderTotal(order) {
  return order.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
}

// Dashboard statistics
const deliveredOrders = orders.filter(
  (order) => order.status === "delivered"
);

const totalRevenue = deliveredOrders.reduce(
  (sum, order) => sum + orderTotal(order),
  0
);

const ratedOrders = orders.filter(
  (order) => order.rating !== null && order.rating !== undefined
);

const averageRating = ratedOrders.length
  ? ratedOrders.reduce((sum, order) => sum + order.rating, 0) /
    ratedOrders.length
  : 0;

// Best-selling item
const itemSales = {};

orders.forEach((order) => {
  order.items.forEach((item) => {
    itemSales[item.name] = (itemSales[item.name] || 0) + item.qty;
  });
});

const bestItem = Object.entries(itemSales).sort(
  (a, b) => b[1] - a[1]
)[0];

const bestItemName = bestItem?.[0] || "No items";
const bestItemQuantity = bestItem?.[1] || 0;

// Revenue by district, using delivered orders only
const districtRevenue = {};

deliveredOrders.forEach((order) => {
  const district = order.customer.district;

  districtRevenue[district] =
    (districtRevenue[district] || 0) + orderTotal(order);
});

const districts = Object.entries(districtRevenue).sort(
  (a, b) => b[1] - a[1]
);

const maxDistrictRevenue = Math.max(
  ...districts.map(([, revenue]) => revenue),
  1
);

// Formatting
const money = (amount) =>
  `${amount.toLocaleString("en-US")} RWF`;

const statusClasses = {
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const statusLabels = {
  delivered: "Delivered",
  pending: "Pending",
  cancelled: "Cancelled",
};

let activeFilter = "all";
let activePage = "dashboard";

// Main layout
document.querySelector("#app").innerHTML = `
  <div class="min-h-screen bg-slate-50 text-slate-900 md:flex">

    <!-- Sidebar: Dashboard and Orders only -->
    <aside class="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">

      <div class="flex items-center gap-3 px-6 py-6">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-200">
          ♨
        </div>
        <div>
          <h2 class="text-xl font-extrabold tracking-tight">FoodHub</h2>
          <p class="text-xs text-slate-500">Restaurant Manager</p>
        </div>
      </div>

      <nav class="flex gap-2 overflow-x-auto px-3 pb-4 md:flex-col md:overflow-visible">
        <button data-page="dashboard" class="nav-button flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition">
          <span>▦</span> Dashboard
        </button>

        <button data-page="orders" class="nav-button flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition">
          <span>▤</span> Orders
        </button>
      </nav>

      <div class="mt-auto hidden border-t border-slate-100 p-5 md:block">
        <div class="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          Online
        </div>
        <p class="mt-2 text-xs text-slate-400">Restaurant Dashboard v1.0</p>
      </div>
    </aside>

    <!-- Main content -->
    <main class="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

      <!-- Header -->
      <header class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Week 5 · Workshop 1
          </p>
          <h1 id="page-title" class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Restaurant Dashboard
          </h1>
          <p id="page-description" class="mt-2 text-sm text-slate-500 sm:text-base">
            Overview of restaurant orders and sales.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span class="text-sm font-medium">${orders.length} total orders</span>
          </div>
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-md shadow-blue-200">
            N
          </div>
        </div>
      </header>

      <!-- DASHBOARD PAGE -->
      <section id="dashboard-page">

        <!-- Statistics -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">$</div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-500">Total Revenue</p>
                <h2 class="mt-1 text-xl font-extrabold sm:text-2xl">${money(totalRevenue)}</h2>
              </div>
            </div>
            <p class="mt-4 text-xs text-slate-400">From delivered orders only</p>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700">↗</div>
              <div>
                <p class="text-sm font-medium text-slate-500">Delivered Orders</p>
                <h2 class="mt-1 text-3xl font-extrabold">${deliveredOrders.length}</h2>
              </div>
            </div>
            <p class="mt-4 text-xs font-medium text-emerald-600">Successfully delivered</p>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">★</div>
              <div>
                <p class="text-sm font-medium text-slate-500">Average Rating</p>
                <h2 class="mt-1 text-3xl font-extrabold">
                  ${averageRating.toFixed(1)}
                  <span class="text-lg font-semibold text-slate-400">/ 5</span>
                </h2>
              </div>
            </div>
            <p class="mt-4 text-xs text-slate-400">Orders with a rating</p>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl text-orange-700">✦</div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-500">Best-Selling Item</p>
                <h2 class="mt-1 truncate text-2xl font-extrabold">${bestItemName}</h2>
              </div>
            </div>
            <p class="mt-4 text-xs text-slate-400">${bestItemQuantity} items sold</p>
          </article>

        </div>

        <!-- Revenue chart -->
        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold">Revenue by District</h2>
            <p class="mt-1 text-sm text-slate-500">Revenue from delivered orders only</p>
          </div>

          <div class="space-y-5">
            ${
              districts.length
                ? districts.map(([district, revenue]) => {
                    const percentage = (revenue / maxDistrictRevenue) * 100;

                    return `
                      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[120px_minmax(0,1fr)_120px] sm:gap-4">
                        <span class="text-sm font-semibold text-slate-700">${district}</span>
                        <div class="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div class="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500" style="width: ${percentage}%"></div>
                        </div>
                        <span class="text-sm font-semibold text-slate-700 sm:text-right">${money(revenue)}</span>
                      </div>
                    `;
                  }).join("")
                : `<p class="text-sm text-slate-500">No delivered revenue yet.</p>`
            }
          </div>

          <button data-page="orders" class="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            View Orders →
          </button>
        </section>
      </section>

      <!-- ORDERS PAGE -->
      <section id="orders-page" class="hidden">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-bold">All Orders</h2>
              <p class="mt-1 text-sm text-slate-500">Browse and filter restaurant orders.</p>
            </div>
            <span class="w-fit rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
              ${orders.length} orders
            </span>
          </div>

          <!-- Filters -->
          <div class="mb-5 flex flex-wrap gap-2">
            <button data-filter="all" class="filter-button rounded-xl px-4 py-2.5 text-sm font-semibold transition">All</button>
            <button data-filter="delivered" class="filter-button rounded-xl px-4 py-2.5 text-sm font-semibold transition">Delivered</button>
            <button data-filter="pending" class="filter-button rounded-xl px-4 py-2.5 text-sm font-semibold transition">Pending</button>
            <button data-filter="cancelled" class="filter-button rounded-xl px-4 py-2.5 text-sm font-semibold transition">Cancelled</button>
          </div>

          <!-- Orders table -->
          <div class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full min-w-[650px] text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-4 py-4 font-bold">Order ID</th>
                  <th class="px-4 py-4 font-bold">Customer</th>
                  <th class="px-4 py-4 font-bold">District</th>
                  <th class="px-4 py-4 font-bold">Total</th>
                  <th class="px-4 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody id="orders-table-body" class="divide-y divide-slate-100 bg-white"></tbody>
            </table>
          </div>

          <div class="mt-4 flex flex-col justify-between gap-2 text-sm text-slate-500 sm:flex-row">
            <p id="orders-count"></p>
            <p>Currency: RWF</p>
          </div>
        </div>
      </section>

      <footer class="py-6 text-center text-xs text-slate-400">
        Restaurant Dashboard · Built with JavaScript, Vite and Tailwind CSS
      </footer>
    </main>
  </div>
`;

// Render orders according to the selected filter
function renderOrders() {
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const tableBody = document.querySelector("#orders-table-body");

  // innerHTML is acceptable here because this exercise uses our own local data.
  tableBody.innerHTML = filteredOrders.map((order) => `
    <tr class="transition hover:bg-blue-50/50">
      <td class="whitespace-nowrap px-4 py-4 font-bold text-slate-900">#${order.id}</td>
      <td class="whitespace-nowrap px-4 py-4 font-medium text-slate-700">${order.customer.name}</td>
      <td class="whitespace-nowrap px-4 py-4 text-slate-600">${order.customer.district}</td>
      <td class="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">${money(orderTotal(order))}</td>
      <td class="whitespace-nowrap px-4 py-4">
        <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[order.status] || "bg-slate-100 text-slate-600"}">
          ${statusLabels[order.status] || order.status}
        </span>
      </td>
    </tr>
  `).join("");

  if (filteredOrders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-10 text-center text-slate-500">
          No orders found for this filter.
        </td>
      </tr>
    `;
  }

  document.querySelector("#orders-count").textContent =
    `Showing ${filteredOrders.length} of ${orders.length} orders`;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;

    button.className = isActive
      ? "filter-button rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition"
      : "filter-button rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-700";
  });
}

// Switch between Dashboard and Orders
function showPage(page) {
  activePage = page;

  document.querySelector("#dashboard-page").classList.toggle(
    "hidden",
    page !== "dashboard"
  );

  document.querySelector("#orders-page").classList.toggle(
    "hidden",
    page !== "orders"
  );

  document.querySelector("#page-title").textContent =
    page === "dashboard" ? "Restaurant Dashboard" : "Orders";

  document.querySelector("#page-description").textContent =
    page === "dashboard"
      ? "Overview of restaurant orders and sales."
      : "View and filter all restaurant orders.";

  document.querySelectorAll(".nav-button").forEach((button) => {
    const isActive = button.dataset.page === page;

    button.className = isActive
      ? "nav-button flex shrink-0 items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-left font-semibold text-blue-700 ring-1 ring-blue-100 transition"
      : "nav-button flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-blue-700";
  });

  if (page === "orders") {
    renderOrders();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Sidebar navigation and View Orders button
document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

// Filter buttons
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderOrders();
  });
});

// Initial page
renderOrders();
showPage(activePage);
