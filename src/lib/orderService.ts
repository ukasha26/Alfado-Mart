export interface OrderPayload {
    name: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    email: string;
    product: string;
    quantity: string;
    date: string;
}

const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

export const sendOrderToSheets = async (orderData: OrderPayload): Promise<boolean> => {
    try {
        if (!GOOGLE_SHEET_URL) {
            console.error("VITE_GOOGLE_SHEET_URL is not configured.");
            return false;
        }

        console.log("Sending order to Google Sheets:", orderData);
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });
        console.log("Response status:", response.status);
        return true;
    } catch (error) {
        console.error("Order submit karne mein error aaya:", error);
        return false;
    }
};