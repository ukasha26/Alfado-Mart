// Google Apps Script Web App URL for Alfado Mart
const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

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
      instructions: formData.instructions || "",
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

