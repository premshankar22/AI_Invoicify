const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const bcrypt = require("bcrypt")

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // The URL of your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],  // Added "PUT" here
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'images' directory
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Configure multer for file uploads (image handling)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // files will be saved in the uploads folder
  },
  filename: function (req, file, cb) {
    // Use a unique filename: fieldname + current timestamp + random number + original extension
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});
const upload = multer({ storage });


// Assuming you have already required your database connection as 'db'
const util = require('util');

// Create MySQL Connection (Without .env)
const db = mysql.createConnection({
  host: "localhost", // Change if using a remote DB
  user: "prem",      // Your MySQL username
  password: "123456789010", // Your MySQL password
  database: "BILLING_APP", // Your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed: ", err.message);
    return;
  }
  console.log("✅ MySQL Connected...");
});

// Promisify db.query so we can use async/await
const query = util.promisify(db.query).bind(db);


// Real-time connection with Socket.io
io.on("connection", (socket) => {
  console.log("🔵 A user connected");

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected");
  });
});


// API endpoint to register a new user
app.post("/api/register", upload.single("image"), async (req, res) => {
  try {
    const { empId, name, username, phone, password, confirmPassword } = req.body;
    if (!empId || !name || !username || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const imagePath = req.file ? req.file.path : null;

    // Insert the new user into the database
    const sql = `
      INSERT INTO users (emp_id, name, username, phone, password, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [empId, name, username, phone, hashedPassword, imagePath];

    await query(sql, values);
    const user = {
      empId: empId, // from req.body.empId
      name,
      username,
      phone,
      image: imagePath,
    };
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/*app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password are required" });
    }
    
    // Query for user by username or emp_id
    const sql = `SELECT * FROM users WHERE username = ? OR emp_id = ? LIMIT 1`;
    const values = [identifier, identifier];
    const results = await query(sql, values);
    
    if (!results || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const user = results[0];
    // Compare provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Remove sensitive info before sending the response
    delete user.password;
    
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}); */

app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password are required" });
    }
    
    // Query for user by username or emp_id
    const sql = `SELECT * FROM users WHERE username = ? OR emp_id = ? LIMIT 1`;
    const values = [identifier, identifier];
    const results = await query(sql, values);
    
    if (!results || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Alias emp_id to empId and remove sensitive info
    user.empId = user.emp_id;
    delete user.password;
    
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


// GET endpoint to fetch user details by EMP ID
app.get("/api/user/:empId", async (req, res) => {
  try {
    const { empId } = req.params;
    const sql = `
      SELECT emp_id AS empId, name, username, phone, image 
      FROM users 
      WHERE emp_id = ? 
      LIMIT 1
    `;
    const values = [empId];
    const results = await query(sql, values);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: results[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});



// ✅ Route: Add a new supplier/wholesaler
app.post("/api/suppliers", upload.single("image"), (req, res) => {
  try {
    // Destructure fields from the form data (multer handles multipart/form-data)
    let {
      name,
      supplier_id,
      company,
      phone,
      alt_phone,
      email,
      location,
      address,
      product_category,
      website,
      type,
      date_time,
      gst_number,
      notes,
    } = req.body;

    // The product_category may arrive as a JSON string or a comma-separated string.
    // Convert it into an array and then into a JSON string for MySQL.
    try {
      if (typeof product_category === "string") {
        // If the string starts with [ then assume it’s a JSON string; otherwise, split by comma.
        if (product_category.trim().startsWith("[")) {
          product_category = JSON.parse(product_category);
        } else {
          product_category = product_category.split(",").map((item) => item.trim());
        }
      }
    } catch (err) {
      product_category = [];
    }
    const productCategoryJson = JSON.stringify(product_category);

    // If an image was uploaded, get its path; otherwise, set to null.
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename; // e.g., "uploads/image-163234234-123456789.jpg"
    }

    // Prepare the INSERT query.
    // Note: supplier_id, email, and gst_number are expected to be unique as per your table.
    const insertQuery = `
      INSERT INTO suppliers_wholesalers 
      (supplier_id, name, company, phone, alt_phone, email, location, address, product_category, website, type, image, date_time, gst_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      supplier_id,
      name,
      company,
      phone,
      alt_phone,
      email,
      location,
      address,
      productCategoryJson,
      website,
      type,
      imagePath,
      date_time, // Should be in the correct DATETIME format ("YYYY-MM-DD HH:MM:SS")
      gst_number,
      notes,
    ];

    // Execute the query to insert data into MySQL.
    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error("Error inserting supplier:", err);
        return res.status(500).json({ error: "Database error", details: err });
      }
      // Optionally, emit a real-time event to connected clients via socket.io.
      io.emit("newSupplier", { supplier_id, name, company });
      return res.status(200).json({ message: "Supplier added successfully", data: results });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


// PUT endpoint to update supplier details and rating
app.put("/api/suppliers/:supplier_id", upload.single("image"), (req, res) => {
  const supplierId = req.params.supplier_id;
  let {
    name,
    company,
    phone,
    alt_phone,
    email,
    location,
    address,
    product_category,
    website,
    type,
    date_time,
    gst_number,
    notes,
    status,      // For rating table
    quality,     // For rating table
    delivery,    // For rating table
    satisfaction // For rating table
  } = req.body;

  // Process product_category: if string, try to convert to array then stringify for storage.
  try {
    if (typeof product_category === "string") {
      if (product_category.trim().startsWith("[")) {
        product_category = JSON.parse(product_category);
      } else {
        product_category = product_category.split(",").map((item) => item.trim());
      }
    }
  } catch (err) {
    product_category = [];
  }
  const productCategoryJson = JSON.stringify(product_category);
  let imagePath = req.file ? req.file.path : req.body.existingImage || null;

  // Convert rating fields to numbers.
  quality = Number(quality);
  delivery = Number(delivery);
  satisfaction = Number(satisfaction);

  // Update query for suppliers_wholesalers table.
  const supplierUpdateQuery = `
    UPDATE suppliers_wholesalers
    SET name = ?,
        company = ?,
        phone = ?,
        alt_phone = ?,
        email = ?,
        location = ?,
        address = ?,
        product_category = ?,
        website = ?,
        type = ?,
        image = ?,
        date_time = ?,
        gst_number = ?,
        notes = ?
    WHERE supplier_id = ?
  `;
  const supplierValues = [
    name,
    company,
    phone,
    alt_phone,
    email,
    location,
    address,
    productCategoryJson,
    website,
    type,
    imagePath,
    date_time,
    gst_number,
    notes,
    supplierId,
  ];

  db.query(supplierUpdateQuery, supplierValues, (err, supplierResult) => {
    if (err) {
      console.error("Error updating supplier:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    // Now update (or insert) the rating details using an UPSERT (ON DUPLICATE KEY UPDATE)
    const ratingUpdateQuery = `
      INSERT INTO rating (supplier_id, status, quality, delivery, satisfaction)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          quality = VALUES(quality),
          delivery = VALUES(delivery),
          satisfaction = VALUES(satisfaction)
    `;
    const ratingValues = [supplierId, status, quality, delivery, satisfaction];
    db.query(ratingUpdateQuery, ratingValues, (err, ratingResult) => {
      if (err) {
        console.error("Error updating rating:", err);
        return res.status(500).json({ error: "Database error in rating", details: err });
      }
      // Optionally, emit a socket.io event for real-time updates.
      io.emit("supplierUpdated", { supplier_id: supplierId });
      return res.status(200).json({ message: "Supplier and rating updated successfully" });
    });
  });
});


// GET endpoint to fetch suppliers with their rating details
app.get("/api/suppliers", (req, res) => {
  // The query joins suppliers_wholesalers (alias s) with rating (alias r)
  // using a LEFT JOIN so that suppliers without a corresponding rating still appear.
  const query = `
    SELECT 
      s.*, 
      r.status, 
      r.quality, 
      r.delivery, 
      r.satisfaction
    FROM suppliers_wholesalers s
    LEFT JOIN rating r ON s.supplier_id = r.supplier_id
    ORDER BY s.id ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching suppliers:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.status(200).json(results);
  });
});


// API endpoint to create a new order along with its products
app.post("/api/orders", (req, res) => {
  // Destructure order details from request body
  const {
    orderID,         // Business order identifier (e.g., "ORD-XXXX")
    orderDate,       // Order Date & Time
    supplierID,      // Supplier ID (from suppliers_wholesalers)
    deliveryDate,    // Delivery date
    paymentMethod,
    paymentStatus,
    currency,
    shippingAddress,
    orderNotes,
    orderStatus,
    transactionId,   // May be empty if paymentMethod === "Cash"
    grandTotal,      // Calculated grand total
    products         // Array of order products; each product has: id, category, name, unit, price, quantity, total
  } = req.body;

  // Begin transaction on the existing connection (db)
  db.beginTransaction((trxErr) => {
    if (trxErr) {
      console.error("Transaction error:", trxErr);
      return res.status(500).json({ error: "Transaction error", details: trxErr });
    }

    // Insert into orders table
    const orderQuery = `
      INSERT INTO orders (
        order_id, order_date, supplier_id, delivery_date, payment_method, 
        payment_status, currency, shipping_address, order_notes, order_status, 
        transaction_id, grand_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [
      orderID,
      orderDate,
      supplierID,
      deliveryDate,
      paymentMethod,
      paymentStatus,
      currency,
      shippingAddress,
      orderNotes,
      orderStatus,
      paymentMethod !== "Cash" ? transactionId : "",
      grandTotal
    ];

    db.query(orderQuery, orderValues, (orderErr, orderResult) => {
      if (orderErr) {
        return db.rollback(() => {
          console.error("Error inserting order:", orderErr);
          return res.status(500).json({ error: "Database error", details: orderErr });
        });
      }
      // Get the auto-generated id of the inserted order
      const newOrderId = orderResult.insertId;

      // Prepare values for order_products insertion.
      const productValues = products.map(product => [
        newOrderId,
        product.id,      // product id from the front-end (should match products.product_id)
        product.category,
        product.name,
        product.unit,
        product.price,
        product.quantity,
        product.total    // total amount for that product line
      ]);

      // Insert multiple rows into order_products table using bulk insert.
      const productQuery = `
        INSERT INTO order_products (
          order_id, product_id, category, product_name, unit, price, quantity, total_amount
        ) VALUES ?
      `;
      db.query(productQuery, [productValues], (prodErr, prodResult) => {
        if (prodErr) {
          return db.rollback(() => {
            console.error("Error inserting order products:", prodErr);
            return res.status(500).json({ error: "Database error", details: prodErr });
          });
        }

        // Commit the transaction
        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              console.error("Commit error:", commitErr);
              return res.status(500).json({ error: "Database commit error", details: commitErr });
            });
          }
          return res.status(200).json({
            message: "Order placed successfully",
            orderId: newOrderId
          });
        });
      });
    });
  });
});


// GET endpoint to fetch all products
app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.status(200).json(results);
  });
});


// PUT endpoint to update a product
app.put("/api/products/:product_id", (req, res) => {
  // Destructure fields from the request body.
  // Note: Our React form sends keys like productName, productId, etc.
  const {
    category,
    brand,
    tags,
    product_name,
    unitMeasurement,
    quantity,
    wholesalePrice,
    unitPrice,
    tax,
    discountType,
    discountValue,
    productStatus,
    stockThreshold,
    dateOfEntry,
    expiryDate,
    warrantyInfo,
    description,
    image,
  } = req.body;

  // Get the product_id from the route parameters.
  const product_id = req.params.product_id;

  // Construct the UPDATE query. We update all the fields.
  const query = `
    UPDATE products
    SET
      product_name = ?,
      category = ?,
      brand = ?,
      tags = ?,
      unit_measurement = ?,
      quantity = ?,
      wholesale_price = ?,
      unit_price = ?,
      tax = ?,
      discount_type = ?,
      discount_value = ?,
      product_status = ?,
      stock_threshold = ?,
      date_of_entry = ?,
      expiry_date = ?,
      warranty_info = ?,
      description = ?,
      image = ?
    WHERE product_id = ?
  `;

  const values = [
    product_name,
    category,
    brand,
    tags,
    unitMeasurement,
    quantity,
    wholesalePrice,
    unitPrice,
    tax,
    discountType,
    discountValue,
    productStatus,
    stockThreshold,
    dateOfEntry,   // Ensure this is in a valid date format (YYYY-MM-DD) or leave it null
    expiryDate,    // Can be null if not provided
    warrantyInfo,
    description,
    image,
    product_id,
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    return res.status(200).json({ message: "Product updated successfully" });
  });
});


// KPI API endpoint: calculates stock and value metrics from the products table
app.get("/api/kpis", (req, res) => {
  const query = `
    SELECT 
      SUM(quantity) AS total_stock,
      SUM(unit_price * quantity) AS total_retail,
      SUM(wholesale_price * quantity) AS total_cost
    FROM products
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching KPI data:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    const data = results[0];
    // Calculate potential profit as retail value minus cost value.
    const potential_profit = (data.total_retail || 0) - (data.total_cost || 0);
    return res.status(200).json({
      total_stock: data.total_stock || 0,
      total_retail: data.total_retail || 0,
      total_cost: data.total_cost || 0,
      potential_profit,
    });
  });
});


//POST /api/expenses to create a new expense 
app.post('/api/expenses', upload.array('files'), (req, res) => {
  // Extract fields from the request body
  const {
    expenseID,
    name,
    amount,
    category,
    paymentDate,
    description,
    paidTo,
    paymentMethod,
    status,
    vendorName,
    currencyType,
    dueDate,
    expenseType,
    taxInfo,
    transactionID,
    notes
  } = req.body;

  // Process uploaded files:
  // Get an array of file names (or file paths if preferred)
  const fileNames = req.files.map(file => file.filename); 
  // Convert the array to a JSON string for storage
  const filesJSON = JSON.stringify(fileNames);
  
  console.log('Uploaded files:', req.files);

  // SQL query to insert a new expense record (now including files)
  const sql = `
    INSERT INTO expenses (
      expenseID, name, amount, category, paymentDate, description, paidTo, 
      paymentMethod, status, vendorName, currencyType, dueDate, expenseType, 
      taxInfo, transactionID, notes, files
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

   // If paymentMethod is "Cash", set transactionID to null
   const transactionIDValue = paymentMethod !== "Cash" ? transactionID : "";


  const values = [
    expenseID,
    name,
    amount,
    category,
    paymentDate,
    description,
    paidTo,
    paymentMethod,
    status,
    vendorName,
    currencyType,
    dueDate,
    expenseType,
    taxInfo,
    transactionIDValue,
    notes,
    filesJSON  // Store file info here
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting expense:', err);
      return res.status(500).json({ error: 'Failed to add expense' });
    }
    res.json({ message: 'Expense added successfully', expenseId: result.insertId });
  });
});  


// GET /api/expenses to fetch all expense records
app.get('/api/expenses', (req, res) => {
  const sql = "SELECT * FROM expenses";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({ error: "Failed to fetch expenses" });
    }
    res.json(results);
  });
});


// DELETE /api/expenses/:expenseID to delete an expense by expenseID
app.delete('/api/expenses/:expenseID', (req, res) => {
  const { expenseID } = req.params;
  const sql = "DELETE FROM expenses WHERE expenseID = ?";
  db.query(sql, [expenseID], (err, result) => {
    if (err) {
      console.error("Error deleting expense:", err);
      return res.status(500).json({ error: "Failed to delete expense" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  });
});


app.post("/api/invoices", (req, res) => {
  const {
    invoiceId,
    customerId,
    invoiceDate,
    grandTotal,
    bagType,
    bagQuantity,
    bagPrice,
    bagTotal,
    km,
    deliveryCharge,
    combinedTotal,
    couponCode,
    couponDiscount,
    finalGrandTotal,
    paymentStatus,
    paymentMethod,
    currencyType,
    transaction_id: transactionId, // or use transactionId
    shippingCustomerName,
    shippingCustomerPhone,
    shippingAddress,
    products, // array of products with sold quantity included
  } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Invalid or empty products array" });
  }

  // Convert invoiceDate to MySQL datetime format
  const formattedInvoiceDate = new Date(invoiceDate)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  // Invoice insert query
  const invoiceQuery = `
    INSERT INTO invoices 
    (invoice_id, customer_id, invoice_date, grand_total, bag_type, bag_quantity, bag_price, bag_total, 
     km, delivery_charge, combined_total, coupon_code, coupon_discount, final_grand_total, 
     payment_status, payment_method, currency_type, transaction_id, shipping_customer_name, 
     shipping_customer_phone, shipping_address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const invoiceValues = [
    invoiceId,
    customerId,
    formattedInvoiceDate,
    grandTotal,
    bagType,
    bagQuantity,
    bagPrice,
    bagTotal,
    km,
    deliveryCharge,
    combinedTotal,
    couponCode,
    couponDiscount,
    finalGrandTotal,
    paymentStatus,
    paymentMethod,
    currencyType,
    transactionId,
    shippingCustomerName,
    shippingCustomerPhone,
    shippingAddress,
  ];

  // Query to insert a record into invoice_products
  const productInsertQuery = `
    INSERT INTO invoice_products 
    (invoice_id, product_id, category, product_name, brand, quantity, unit, unit_price, gst, gst_amount, discount_type, discount_value, sub_total, net_amount) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Query to update the product's inventory quantity.
  // This query subtracts the sold quantity from the current inventory
  // and ensures that the product has enough quantity.
  const productUpdateQuery = `
    UPDATE products 
    SET quantity = quantity - ? 
    WHERE product_id = ? AND quantity >= ?
  `;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).json({ error: "Transaction failed" });
    }

    // First, insert the invoice record
    db.query(invoiceQuery, invoiceValues, (error, results) => {
      if (error) {
        return db.rollback(() => {
          console.error("Error inserting invoice:", error);
          res.status(500).json({ error: "Failed to create invoice", details: error.message });
        });
      }

      // For each product in the invoice, insert the invoice_products record and update product inventory.
      const productPromises = products.map((prod) => {
        return new Promise((resolve, reject) => {
          // First, insert the invoice product record
          const productValues = [
            invoiceId,
            prod.productId,
            prod.category,
            prod.productName,
            prod.brand,
            prod.quantity, // quantity sold in this invoice
            prod.unit,
            prod.unitPrice,
            prod.gst,
            prod.gstAmount,
            prod.discountType,
            prod.discountValue,
            prod.subTotal,
            prod.netAmount,
          ];

          db.query(productInsertQuery, productValues, (prodError, prodResults) => {
            if (prodError) {
              return reject(prodError);
            }

            // Then update the product inventory:
            // Subtract the sold quantity from the available quantity.
            db.query(productUpdateQuery, [prod.quantity, prod.productId, prod.quantity], (updateError, updateResults) => {
              if (updateError) {
                return reject(updateError);
              }
              // If no rows were affected, there isn't enough inventory.
              if (updateResults.affectedRows === 0) {
                return reject(new Error(`Insufficient quantity for product ${prod.productId}`));
              }
              resolve(updateResults);
            });
          });
        });
      });

      Promise.all(productPromises)
        .then(() => {
          db.commit((commitErr) => {
            if (commitErr) {
              console.error("Commit Error:", commitErr);
              return db.rollback(() => {
                res.status(500).json({ error: "Transaction commit failed" });
              });
            }
            res.status(201).json({ message: "Invoice created and inventory updated successfully" });
          });
        })
        .catch((prodError) => {
          db.rollback(() => {
            console.error("Error processing products:", prodError);
            res.status(500).json({ error: "Failed to process products", details: prodError.message });
          });
        });
    });
  });
});



// GET endpoint to fetch full details of an invoice (from both invoices and invoice_products)
app.get("/api/invoices/:invoiceId", (req, res) => {
  const { invoiceId } = req.params;

  // Query to fetch the invoice details
  const invoiceQuery = "SELECT * FROM invoices WHERE invoice_id = ?";
  db.query(invoiceQuery, [invoiceId], (invoiceErr, invoiceResults) => {
    if (invoiceErr) {
      console.error("Error fetching invoice:", invoiceErr);
      return res.status(500).json({ error: "Failed to fetch invoice", details: invoiceErr.message });
    }
    if (invoiceResults.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    const invoice = invoiceResults[0];

    // Query to fetch all products associated with the invoice
    const productsQuery = "SELECT * FROM invoice_products WHERE invoice_id = ?";
    db.query(productsQuery, [invoiceId], (prodErr, productResults) => {
      if (prodErr) {
        console.error("Error fetching invoice products:", prodErr);
        return res.status(500).json({ error: "Failed to fetch invoice products", details: prodErr.message });
      }
      // Return a JSON object with both invoice and products data
      return res.status(200).json({ invoice, products: productResults });
    });
  });
});


// GET endpoint to fetch all invoices
app.get("/api/invoices", (req, res) => {
  const query = "SELECT * FROM invoices ORDER BY invoice_date DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching invoices:", err);
      return res.status(500).json({ error: "Failed to fetch invoices", details: err.message });
    }
    return res.status(200).json(results);
  });
});


// DELETE endpoint to delete an invoice and its associated products
app.delete("/api/invoices/:invoiceId", (req, res) => {
  const { invoiceId } = req.params;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).json({ error: "Transaction failed" });
    }

    // First, delete all products associated with the invoice
    const deleteProductsQuery = "DELETE FROM invoice_products WHERE invoice_id = ?";
    db.query(deleteProductsQuery, [invoiceId], (prodErr, prodResults) => {
      if (prodErr) {
        return db.rollback(() => {
          console.error("Error deleting invoice products:", prodErr);
          res.status(500).json({ error: "Failed to delete invoice products", details: prodErr.message });
        });
      }

      // Then, delete the invoice itself
      const deleteInvoiceQuery = "DELETE FROM invoices WHERE invoice_id = ?";
      db.query(deleteInvoiceQuery, [invoiceId], (invErr, invResults) => {
        if (invErr) {
          return db.rollback(() => {
            console.error("Error deleting invoice:", invErr);
            res.status(500).json({ error: "Failed to delete invoice", details: invErr.message });
          });
        }

        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              console.error("Commit Error:", commitErr);
              res.status(500).json({ error: "Transaction commit failed" });
            });
          }
          res.status(200).json({ message: "Invoice deleted successfully" });
        });
      });
    });
  });
});


// POST endpoint to add a new product (only four columns are provided)
app.post("/api/products", (req, res) => {
  const { product_id, product_name, category, brand } = req.body;

  // Validate required fields
  if (!product_id || !product_name || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert only the four columns; others will take their default values
  const insertQuery = `
    INSERT INTO products (product_id, product_name, category, brand)
    VALUES (?, ?, ?, ?)
  `;
  const values = [product_id, product_name, category, brand];

  db.query(insertQuery, values, (err, results) => {
    if (err) {
      console.error("Error inserting product:", err);
      return res.status(500).json({
        error: "Failed to insert product",
        details: err.message,
      });
    }
    res.status(201).json({ message: "Product added successfully" });
  });
});


//Sample route to fetch data from the 'invoices' table
app.get('/api/sales', async (req, res) => {
  try {
    let sql = 'SELECT * FROM invoices';
    let params = [];
    // Optional dynamic filtering: e.g., ?month=5 to filter by May
    if (req.query.month) {
      sql += ' WHERE MONTH(invoice_date) = ?';
      params.push(req.query.month);
    }
    const results = await query(sql, params);
    res.json(results);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Database error', details: error.message });
  }
});

// For invoice_products
app.get('/api/invoice-products', async (req, res) => {
  try {
    const sql = 'SELECT * FROM invoice_products';
    const results = await query(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching invoice products data:', error);
    res.status(500).json({ message: 'Database error', details: error.message });
  }
}); 

// Fetch all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const sql = 'SELECT * FROM expenses';
    const results = await query(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching expense data:', error);
    res.status(500).json({ message: 'Database error', details: error.message });
  }
});
 


// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    let sql = 'SELECT * FROM products';
    let params = [];
    // Optional dynamic filtering: e.g., ?category=Electronics
    if (req.query.category) {
      sql += ' WHERE category = ?';
      params.push(req.query.category);
    }
    const results = await query(sql, params);
    res.json(results);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ message: 'Database error', details: error.message });
  }
});  


// Overview API route
app.get('/overview', (req, res) => {
  const overviewQuery = `
    SELECT 
      (SELECT COUNT(*) FROM invoices) AS total_invoices,
      (SELECT SUM(grand_total) FROM invoices) AS total_revenue,
      (SELECT SUM(amount) FROM expenses) AS total_expenses;
  `;

  db.query(overviewQuery, (err, result) => {
    if (err) {
      console.error('Error fetching overview data: ' + err.stack);
      return res.status(500).json({ error: 'Server error' });
    }
  
    console.log('DB result:', result); // Log the result from the database
    const { total_invoices, total_revenue, total_expenses } = result[0];
    const profit_loss = total_revenue - total_expenses;
    const profit_loss_color = profit_loss >= 0 ? '#c8e6c9' : '#ffcdd2';
  
    res.json({
      total_invoices,
      total_revenue,
      total_expenses,
      profit_loss,
      profit_loss_color,
    });
  });
});


// Delete Product API
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  console.log("Attempting to delete product with ID:", productId); // Add this line for debugging

  const query = "DELETE FROM products WHERE product_id = ?";
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error("❌ Error deleting product: ", err);
      return res.status(500).json({ error: "Error deleting product" });
    }

    if (result.affectedRows > 0) {
      console.log(`✅ Product with ID: ${productId} deleted successfully.`);
      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      console.log(`❌ Product with ID: ${productId} not found.`);
      return res.status(404).json({ message: "Product not found" });
    }
  });
});


app.get("/api/orders/:supplierID", (req, res) => {
  const supplierID = req.params.supplierID;
  console.log("Supplier ID received:", supplierID); // Debugging

  const orderQuery = `
    SELECT o.order_id, o.order_date, o.delivery_date, o.payment_method, o.payment_status, 
           o.currency, o.order_status, o.grand_total, op.product_id, op.product_name, 
           op.category, op.unit, op.price, op.quantity, op.total_amount
    FROM orders o
    LEFT JOIN order_products op ON o.order_id = op.order_id
    WHERE o.supplier_id = ?;
  `;

  db.query(orderQuery, [supplierID], (err, results) => {
    if (err) {
      console.error("Error fetching order history:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    console.log("Query Results:", results); // Debugging

    if (results.length === 0) {
      console.warn(`No order history found for Supplier ID: ${supplierID}`);
      return res.status(404).json({ message: "No order history found for this supplier." });
    }

    res.json(results);
  });
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
