const form = document.getElementById('itemForm');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const tableBody = document.getElementById('tableBody');
const submitBtn = document.getElementById('submitBtn');

let items = [];    // copy of the items received from the server
let editId = null; // null = adding new, number = editing that item

// Load items from server and show them in the table
async function loadItems() {
  const response = await fetch('/api/items');
  items = await response.json();

  tableBody.innerHTML = '';
  items.forEach(item => {
    tableBody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>
          <button onclick="editItem(${item.id})">Edit</button>
          <button onclick="deleteItem(${item.id})">Delete</button>
        </td>
      </tr>`;
  });
}

// Submit form: create or update
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = { name: nameInput.value, price: priceInput.value };
  let response;

  if (editId === null) {
    // CREATE
    response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } else {
    // UPDATE
    response = await fetch('/api/items/' + editId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  // Show the server's error message if something went wrong
  if (!response.ok) {
    const error = await response.json();
    alert(error.message);
    return;
  }

  editId = null;
  submitBtn.textContent = 'Submit';
  form.reset();
  loadItems();
});

// Edit: put the item's values into the form
function editItem(id) {
  const item = items.find(i => i.id === id);
  editId = id;
  nameInput.value = item.name;
  priceInput.value = item.price;
  submitBtn.textContent = 'Update';
}

// DELETE
async function deleteItem(id) {
  await fetch('/api/items/' + id, { method: 'DELETE' });
  loadItems();
}

// Show items when the page opens
loadItems();