
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

mongoose.connect('mongodb://localhost:27017/budgetdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


const budgetSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  notes: String,
});

const Budget = mongoose.model('Budget', budgetSchema);


app.get('/api/budget', async (_req, res) => {
  try {
    const items = await Budget.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get budget items' });
  }
});

// Create a new budget item
app.post('/api/budget', async (req, res) => {
  try {
    const newItem = new Budget(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save budget item' });
  }
});

// Update a budget item by id
app.put('/api/budget/:id', async (req, res) => {
  try {
    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update budget item' });
  }
});

app.delete('/api/budget/:id', async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete budget item' });
  }
});


app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'budget.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
