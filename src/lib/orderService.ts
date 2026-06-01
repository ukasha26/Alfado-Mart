// Google Apps Script Web App URL for Alfado Mart
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz9qwkjaNe7w26r5CV2Jpq_0VoSFNrZA1Jwo0oK1ZTIvWqUNKjDhRH9FbkhBc4wtr-k/exec";

/**
 * 1. Google Sheets par Order Send karne ka function
 */
export const sendOrderToSheets = async (formData: {
  fullName: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  city: string;
  instructions?: string;
  product: string;
  quantity: number | string;
  price: number;
}) => {
  try {
    // Keys mapping as per your Google Script structure
    const payload = {
      name: formData.fullName,
      fullName: formData.fullName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || "",
      address: formData.address,
      city: formData.city,
      email: formData.email,
      product: formData.product,
      quantity: formData.quantity,
      price: formData.price,
      nearestFamousPlace: formData.instructions || "",
      date: new Date().toLocaleString()
    };

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors", // Crucial for Google Script macro triggers bypass
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Order submitted to Google Sheets successfully.");
    return { status: "success" };
  } catch (error) {
    console.error("Error submitting order to Google Sheets:", error);
    throw error;
  }
};

