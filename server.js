const express = require('express');
const app = express();

app.use(express.json());           // read JSON sent from the browser or Postman
app.use(express.static('public')); // serve the files in the public folder

// Our "database": an array of items
let items = [
  { id: 1, name: 'Book', price: 250 },
  { id: 2, name: 'Pen', price: 25 }
];
let nextId = 3;

// Check that name and price are valid
function isValid(body) {
  return body && body.name && body.price !== undefined && !isNaN(Number(body.price));
}

// READ: get all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// CREATE: add a new item
app.post('/api/items', (req, res) => {
  if (!isValid(req.body)) {
    return res.status(400).json({ message: 'name and price are required (price must be a number)' });
  }

  const item = { id: nextId++, name: req.body.name, price: Number(req.body.price) };
  items.push(item);
  res.status(201).json(item);
});

// UPDATE: change an existing item
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (!isValid(req.body)) {
    return res.status(400).json({ message: 'name and price are required (price must be a number)' });
  }

  item.name = req.body.name;
  item.price = Number(req.body.price);
  res.json(item);
});

// DELETE: remove an item
app.delete('/api/items/:id', (req, res) => {
  const exists = items.some(i => i.id === Number(req.params.id));
  if (!exists) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items = items.filter(i => i.id !== Number(req.params.id));
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});