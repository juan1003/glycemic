const express = require('express');
const multer = require('multer');
const path = require('path');
const MealController = require('./src/controllers/mealController');

const app = express();
const port = 3000;

// Set up storage for uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.post('/api/calculate', upload.single('mealPlan'), (req, res) => {
  MealController.processMealPlan(req, res);
});

// Start the server
app.listen(port, () => {
  console.log(`Glycemic Index Calculator running at http://localhost:${port}`);
});
