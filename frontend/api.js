// // src/api.js

// const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// const API_BASE_URL = isLocal
//   ? "http://127.0.0.1:5001/api" // local backend
//   : "https://quickcard-e-ecommerce-2.onrender.com/api"; // deployed backend

// // 🛍️ Fetch all products
// export async function getProducts() {
//   const response = await fetch(`${API_BASE_URL}/products`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch products");
//   }
//   return await response.json();
// }

// // 🧩 Fetch all categories
// export async function getCategories() {
//   const response = await fetch(`${API_BASE_URL}/categories`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch categories");
//   }
//   return await response.json();
// }
// src/api.js

// Determine backend URL dynamically
// src/api.js
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const API_BASE_URL = isLocal
  ? "http://127.0.0.1:5001/api" // <-- Make sure this matches your Flask port
  : "https://quickcard-e-ecommerce-2.onrender.com/api";

// Fetch all products
export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

// Fetch all categories
export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return await res.json();
}

// Fetch featured products
export async function getFeaturedProducts() {
  const res = await fetch(`${API_BASE_URL}/featured-products`);
  if (!res.ok) throw new Error("Failed to fetch featured products");
  return await res.json();
}
