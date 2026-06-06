const orderConfirmationEmail = (user, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name} (Size: ${item.size || "N/A"})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `
    )
    .join("");

  return {
    subject: `Order Confirmation - Order #${order.id.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #1a1a1a; text-align: center;">Thank You for Your Order!</h2>
        <p>Hi ${user.name || "Customer"},</p>
        <p>Your order has been successfully placed. Here are your order details:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f1f1f1;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 16px; margin: 20px 0;">
          <p><strong>Subtotal:</strong> ₹${order.subtotal}</p>
          ${order.discount > 0 ? `
          <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
            <span style="color:#4ade80; font-family:sans-serif; font-size:14px; margin-right:20px;">
              Discount${order.couponCode ? ` (${order.couponCode})` : ""}
            </span>
            <span style="color:#4ade80; font-family:sans-serif; font-size:14px; font-weight:600;">
              -₹${order.discount.toLocaleString("en-IN")}
            </span>
          </div>
          ` : ""}
          <p><strong>Delivery Charge:</strong> ₹${order.deliveryCharge}</p>
          <p style="font-size: 18px; color: #111;"><strong>Total:</strong> ₹${order.total}</p>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <h3>Shipping Address</h3>
          <p>${order.address?.fullName || user.name}</p>
          <p>${order.address?.line1 || ""}${order.address?.line2 ? ", " + order.address.line2 : ""}</p>
          <p>${order.address?.city || ""}, ${order.address?.state || ""} - ${order.address?.pincode || ""}</p>
          <p>Phone: ${order.address?.phone || ""}</p>
        </div>
      </div>
    `,
  };
};

const orderStatusEmail = (user, order) => {
  return {
    subject: `Order Status Update - Order #${order.id.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #1a1a1a; text-align: center;">Order Status Update</h2>
        <p>Hi ${user.name || "Customer"},</p>
        <p>The status of your order <strong>#${order.id}</strong> has been updated to:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <span style="font-size: 20px; font-weight: bold; color: #0066cc; text-transform: uppercase;">
            ${order.status}
          </span>
        </div>

        <p>We will keep you updated as your order progresses.</p>
        <p>Thank you for shopping with Shoemart!</p>
      </div>
    `,
  };
};

module.exports = { orderConfirmationEmail, orderStatusEmail };