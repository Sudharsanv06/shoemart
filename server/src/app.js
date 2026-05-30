const express  = require("express");
const cors     = require("cors");
const dotenv   = require("dotenv");
dotenv.config();

const app = express();

const allowedOrigins = new Set(
	[process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean)
);

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.has(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/cart",     require("./routes/cart.routes"));
app.use("/api/wishlist", require("./routes/wishlist.routes"));
app.use("/api/orders",   require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/admin",    require("./routes/admin.routes"));

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Error handler
app.use(require("./middlewares/error.middleware"));

module.exports = app;
