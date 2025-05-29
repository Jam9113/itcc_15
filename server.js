const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'frontend')));


mongoose.connect('mongodb://localhost:27017/maintenanceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const maintenanceSchema = new mongoose.Schema({
  task: String,
  date: String,
  status: String,
}, { timestamps: true });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

// Routes
app.get('/api/maintenance', async (req, res) => {
  const tasks = await Maintenance.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post('/api/maintenance', async (req, res) => {
  const { task, date, status } = req.body;
  if (!task || !date || !status) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }
  const newTask = new Maintenance({ task, date, status });
  await newTask.save();
  res.status(201).json(newTask);
});

app.put('/api/maintenance/:id', async (req, res) => {
  const { id } = req.params;
  const { task, date, status } = req.body;
  try {
    const updatedTask = await Maintenance.findByIdAndUpdate(id, { task, date, status }, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

app.delete('/api/maintenance/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Maintenance.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
