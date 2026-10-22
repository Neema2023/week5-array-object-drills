
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
