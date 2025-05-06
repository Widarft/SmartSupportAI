export const generateCustomerId = () => {
  try {
    const id = "cust-" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("customerId", id);
    return id;
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return "cust-" + Date.now();
  }
};
