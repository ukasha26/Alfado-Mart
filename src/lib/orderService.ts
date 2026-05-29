// 🌐 Google Apps Script Web App URL for Alfado Mart
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
}) => {
  try {
    // Keys mapping as per your Google Script structure
    const payload = {
      name: formData.fullName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || "",
      address: formData.address,
      city: formData.city,
      email: formData.email,
      product: formData.product,
      quantity: formData.quantity,
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

/**
 * 2. 📧 Transactional Resend API Function
 */
export const sendEmailViaResend = async (orderData: {
  name: string;
  email: string;
  product: string;
  quantity: string | number;
}) => {
  try {
    const apiKey = import.meta.env.VITE_RESEND_API_KEY;
    if (!apiKey) {
      console.error("VITE_RESEND_API_KEY is missing in your environment variables!");
      return null;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      mode: 'cors', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Alfado Mart <onboarding@resend.dev>', 
        to: [orderData.email], 
        subject: '🎉 Alfado Mart - Your Order is Confirmed!',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef2f3; border-radius: 8px; background-color: #ffffff; color: #333333; line-height: 1.6;">
            <h2 style="color: #4CAF50; margin-top: 0;">🎉 Order Confirmed!</h2>
            <p>Dear <strong>${orderData.name}</strong>,</p>
            <p>Thank you for shopping at <strong>Alfado Mart</strong>! Your order has been successfully received and is being processed.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; border-radius: 0 4px 4px 0;">
              <h4 style="margin: 0 0 10px 0; color: #333;">📦 Order Details:</h4>
              <p style="margin: 5px 0;"><strong>🛒 Product:</strong> ${orderData.product}</p>
              <p style="margin: 5px 0;"><strong>🔢 Quantity:</strong> ${orderData.quantity}</p>
            </div>
            
            <p><strong>🚚 Delivery Notice:</strong> Your package will be safely delivered to your address within 3-5 working days.</p>
            <p style="font-size: 13px; color: #666;"><em>Note: Our team might call you for final verification before dispatching.</em></p>
            
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <p style="margin-bottom: 0;">Best Regards,<br><strong>Team Alfado Mart</strong><br>
            <a href="https://alfadomart.store" style="color: #4CAF50; text-decoration: none;">alfadomart.store</a></p>
          </div>
        `
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API Error status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Resend Send Email Result Success:", result);
    return result;

  } catch (error) {
    console.error("Failed to send email via Resend API:", error);
    return null; 
  }
};