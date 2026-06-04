const PDFDocument = require("pdfkit");

const generateInvoice = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];

      doc.on("data",  (chunk) => buffers.push(chunk));
      doc.on("end",   () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // ── HEADER ──────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 80).fill("#0D0D0D");

      doc.fillColor("#C9A84C")
         .font("Helvetica-Bold")
         .fontSize(24)
         .text("SHOEMART", 50, 28, { align: "left" });

      doc.fillColor("#8A8A8A")
         .font("Helvetica")
         .fontSize(9)
         .text("PREMIUM FOOTWEAR", 50, 56, { align: "left" });

      doc.fillColor("#FFFFFF")
         .font("Helvetica-Bold")
         .fontSize(11)
         .text("INVOICE", 0, 35, { align: "right" });

      // ── ORDER INFO BOX ───────────────────────────────────
      doc.rect(50, 100, doc.page.width - 100, 80)
         .fillAndStroke("#1A1A1A", "#C9A84C");

      doc.fillColor("#8A8A8A").font("Helvetica").fontSize(8)
         .text("ORDER NUMBER", 70, 115)
         .text("DATE",         250, 115)
         .text("PAYMENT",      400, 115);

      doc.fillColor("#C9A84C").font("Helvetica-Bold").fontSize(11)
         .text(`#${order.orderNumber}`, 70,  130)
         .text(new Date(order.createdAt).toLocaleDateString("en-IN", {
           day: "numeric", month: "long", year: "numeric"
         }), 250, 130)
         .text(order.paymentMethod, 400, 130);

      doc.fillColor("#4ade80").font("Helvetica-Bold").fontSize(9)
         .text(order.paymentStatus, 400, 148);

      // ── BILL TO ──────────────────────────────────────────
      doc.fillColor("#8A8A8A").font("Helvetica").fontSize(8)
         .text("BILL TO", 50, 205);

      doc.fillColor("#F5F0E8").font("Helvetica-Bold").fontSize(11)
         .text(user.name, 50, 218);

      doc.fillColor("#8A8A8A").font("Helvetica").fontSize(9)
         .text(user.email, 50, 233);

      if (order.address) {
        doc.fillColor("#8A8A8A").font("Helvetica").fontSize(9)
           .text(`${order.address.line1}${order.address.line2 ? ", " + order.address.line2 : ""}`, 50, 248)
           .text(`${order.address.city}, ${order.address.state} — ${order.address.pincode}`, 50, 262)
           .text(`Ph: ${order.address.phone}`, 50, 276);
      }

      // ── ITEMS TABLE HEADER ───────────────────────────────
      const tableTop = 310;
      doc.rect(50, tableTop, doc.page.width - 100, 24)
         .fill("#C9A84C");

      doc.fillColor("#0D0D0D").font("Helvetica-Bold").fontSize(8)
         .text("PRODUCT",  60,  tableTop + 8)
         .text("BRAND",    270, tableTop + 8)
         .text("SIZE",     340, tableTop + 8)
         .text("QTY",      390, tableTop + 8)
         .text("PRICE",    430, tableTop + 8)
         .text("TOTAL",    490, tableTop + 8);

      // ── ITEMS ROWS ───────────────────────────────────────
      let y = tableTop + 34;
      order.items.forEach((item, i) => {
        if (i % 2 === 0) {
          doc.rect(50, y - 8, doc.page.width - 100, 24).fill("#1A1A1A");
        }

        doc.fillColor("#F5F0E8").font("Helvetica").fontSize(9)
           .text(item.product.name,  60,  y, { width: 200 })
           .text(item.product.brand, 270, y)
           .text(item.size,          340, y)
           .text(item.quantity,      390, y)
           .text(`Rs.${item.price.toLocaleString("en-IN")}`, 430, y)
           .text(`Rs.${(item.price * item.quantity).toLocaleString("en-IN")}`, 490, y);

        y += 28;
      });

      // ── TOTALS ───────────────────────────────────────────
      y += 16;
      doc.moveTo(50, y).lineTo(doc.page.width - 50, y)
         .strokeColor("#C9A84C").lineWidth(0.5).stroke();
      y += 16;

      const rightCol  = doc.page.width - 150;
      const valueCol  = doc.page.width - 60;

      doc.fillColor("#8A8A8A").font("Helvetica").fontSize(9)
         .text("Subtotal",        rightCol, y,      { align: "right", width: 80 })
         .text(`Rs.${order.subtotal.toLocaleString("en-IN")}`, valueCol, y, { align: "right", width: 60 });
      y += 18;

      doc.fillColor("#8A8A8A").font("Helvetica").fontSize(9)
         .text("Delivery",        rightCol, y,      { align: "right", width: 80 })
         .text(order.deliveryCharge === 0 ? "FREE" : `Rs.${order.deliveryCharge}`, valueCol, y, { align: "right", width: 60 });
      y += 18;

      doc.rect(rightCol - 10, y - 4, 130, 26).fill("#C9A84C");
      doc.fillColor("#0D0D0D").font("Helvetica-Bold").fontSize(11)
         .text("TOTAL",           rightCol, y + 3,  { align: "right", width: 80 })
         .text(`Rs.${order.total.toLocaleString("en-IN")}`, valueCol, y + 3, { align: "right", width: 60 });
      y += 40;

      // ── FOOTER ───────────────────────────────────────────
      doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill("#0D0D0D");

      doc.fillColor("#8A8A8A").font("Helvetica").fontSize(8)
         .text("Thank you for shopping with SHOEMART — Premium Footwear",
           0, doc.page.height - 38, { align: "center" })
         .text("https://shoemart-sigma.vercel.app",
           0, doc.page.height - 24, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateInvoice;
