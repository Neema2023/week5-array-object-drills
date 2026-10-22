
import { orders } from "./data.js";

// Save the original data so we can check immutability.
const ORIGINAL = JSON.stringify(orders);

// Station 1 — Warm-up

// Question 1: Array of all order IDs
const orderIds = orders.map(({ id }) => id);

console.log("Question 1 - All order IDs:", orderIds);

// Check that the original data has not changed.
console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);



 // Question 2: Array of customer names
const customerNames = orders.map(({ customer }) => customer.name);

console.log("Question 2 - Customer names:", customerNames);

// Check that the original data has not changed
console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);



 // Question 3: All delivered orders
const deliveredOrders = orders.filter(
  ({ status }) => status === "delivered"
);

console.log("Question 3 - Delivered orders:", deliveredOrders);

// Check that the original data has not changed
console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);



 
 // Question 4: All orders from Gasabo
const gasaboOrders = orders.filter(
  ({ customer }) => customer.district === "Gasabo"
);

console.log("Question 4 - Gasabo orders:");
console.dir(gasaboOrders, { colors: true, depth: null });

console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);



 // Question 5 - Find the order with ID 106
const order106 = orders.find(({ id }) => id === 106);

console.log("Question 5 - Order with ID 106:");
console.dir(order106, { colors: true, depth: null });

console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);




 // Question 6: Does any order have a rating of 3 or lower?
const hasLowRating = orders.some(
  ({ rating }) => rating !== null && rating <= 3
);

console.log("Question 6 - Any rating of 3 or lower:", hasLowRating);

console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);



 // Question 7: Are all pending orders unrated?
const pendingOrders = orders.filter(
  ({ status }) => status === "pending"
);

const allPendingUnrated = pendingOrders.every(
  ({ rating }) => rating === null
);

console.log("Question 7 - Are all pending orders unrated:", allPendingUnrated);

console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);



 // Question 8: Unique customer names using Set and spread
const uniqueCustomerNames = [
  ...new Set(orders.map(({ customer }) => customer.name))
];

console.log("Question 8 - Unique customer names:", uniqueCustomerNames);

console.log(
  "Original data unchanged:",
  JSON.stringify(orders) === ORIGINAL
);



 // Station 2 - Helper
const orderTotal = ({ items }) =>
  items.reduce((sum, { price, qty }) => sum + price * qty, 0);



 // Question 9: Add total to every order (new objects)
const ordersWithTotal = orders.map((order) => ({
  ...order,
  total: orderTotal(order)
}));

console.log("Question 9 - Orders with totals:");
console.dir(ordersWithTotal, { colors: true, depth: null });
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);


// Question 10: Total revenue from delivered orders only
const deliveredRevenue = orders
  .filter(({ status }) => status === "delivered")
  .reduce((sum, order) => sum + orderTotal(order), 0);

console.log("Question 10 - Delivered revenue:", deliveredRevenue);
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);


// Question 11: Average rating, ignoring null, rounded to 1 decimal
const ratedOrders = orders.filter(({ rating }) => rating !== null);

const averageRating = Number(
  (
    ratedOrders.reduce((sum, { rating }) => sum + rating, 0) /
    ratedOrders.length
  ).toFixed(1)
);

console.log("Question 11 - Average rating:", averageRating);
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);


// Question 12: Total quantity of Brochettes sold
const brochetteQuantity = orders
  .flatMap(({ items }) => items)
  .filter(({ name }) => name === "Brochette")
  .reduce((sum, { qty }) => sum + qty, 0);

console.log("Question 12 - Brochettes sold:", brochetteQuantity);
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);


// Question 13: The single most expensive order
const mostExpensiveOrder = orders
  .map((order) => ({ ...order, total: orderTotal(order) }))
  .reduce((highest, order) =>
    order.total > highest.total ? order : highest
  );

console.log("Question 13 - Most expensive order:");
console.dir(mostExpensiveOrder, { colors: true, depth: null });
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);


// Question 14: Number of orders per status
const ordersByStatus = orders.reduce((counts, { status }) => ({
  ...counts,
  [status]: (counts[status] || 0) + 1
}), {});

console.log("Question 14 - Orders per status:", ordersByStatus);
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);



 // Question 15: Revenue per district from delivered orders
const revenueByDistrict = orders
  .filter(({ status }) => status === "delivered")
  .reduce((revenue, order) => {
    const district = order.customer.district;
    revenue[district] = (revenue[district] || 0) + orderTotal(order);
    return revenue;
  }, {});

console.log("Question 15 - Revenue by district:", revenueByDistrict);
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);



 // Question 16: Group orders by date
const ordersGroupedByDate = Object.groupBy(
  orders,
  ({ date }) => date
);

const dailySummary = Object.entries(ordersGroupedByDate).map(
  ([date, dateOrders]) => ({
    date,
    count: dateOrders.length,
    revenue: dateOrders.reduce(
      (sum, order) => sum + orderTotal(order),
      0
    )
  })
);

console.log("Question 16 - Daily summary:");
console.dir(dailySummary, { colors: true, depth: null });
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);


 // Question 17: Top 3 best-selling items by quantity
const itemTotals = orders
  .flatMap(({ items }) => items)
  .reduce((totals, { name, qty }) => {
    totals[name] = (totals[name] || 0) + qty;
    return totals;
  }, {});

const topThreeItems = Object.entries(itemTotals)
  .map(([name, qty]) => ({ name, qty }))
  .toSorted((a, b) => b.qty - a.qty)
  .slice(0, 3);

console.log("Question 17 - Top 3 best-selling items:", topThreeItems);
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);



 // Question 18: Each customer's order count and total spent
const customerSummary = Object.entries(
  orders.reduce((summary, order) => {
    const name = order.customer.name;

    if (!summary[name]) {
      summary[name] = { name, orders: 0, spent: 0 };
    }

    summary[name].orders += 1;
    summary[name].spent += orderTotal(order);

    return summary;
  }, {})
)
  .map(([, customer]) => customer)
  .toSorted((a, b) => b.spent - a.spent);

console.log("Question 18 - Customer summary:");
console.dir(customerSummary, { colors: true, depth: null });
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);



 // Question 19: Menu price list using Object.fromEntries
const menuPrices = Object.fromEntries(
  orders
    .flatMap(({ items }) => items)
    .map(({ name, price }) => [name, price])
);

console.log("Question 19 - Menu price list:", menuPrices);
console.log("Original data unchanged:", JSON.stringify(orders) === ORIGINAL);
