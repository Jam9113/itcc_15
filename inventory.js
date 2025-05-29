
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); 

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

mongoose.connect('mongodb://localhost:27017/budgetdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const inventorySchema = new mongoose.Schema({
  description: String, 
  amount: Number,     
  category: String,
  notes: String
});

const Inventory = mongoose.model('Inventory', inventorySchema);


app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get inventory items' });
  }
});


app.post('/api/inventory', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save inventory item' });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update inventory item' });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete inventory item' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'inventory.html'));
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
