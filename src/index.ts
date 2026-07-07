import express from 'express';
import multer from 'multer';
import morgan from 'morgan';
import path from 'path';
import MealController from './controllers/mealController';

const app = express();
const port = Number(process.env.PORT) || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined'));

app.post('/api/calculate', upload.single('mealPlan'), (req, res) => {
  MealController.processMealPlan(req, res);
});

app.listen(port, () => {
  console.log(`Glycemic Index Calculator running at http://localhost:${port}`);
});
