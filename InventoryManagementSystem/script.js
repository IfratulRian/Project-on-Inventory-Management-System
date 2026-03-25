let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let undoStack = [];

// Product Constructor
class Product {
    constructor(id, name, qty, price) {
        this.id = id;
        this.name = name;
        this.quantity = qty;
        this.price = price;
    }
}

// Save to localStorage
function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Add Product
function addProduct() {
    const id = Number(document.getElementById("productId").value);
    const name = document.getElementById("productName").value;
    const qty = Number(document.getElementById("productQty").value);
    const price = Number(document.getElementById("productPrice").value);

    if (!id || !name || !qty || !price) {
        alert("Please fill all fields correctly");
        return;
    }

    if (inventory.find(p => p.id === id)) { alert("ID already exists"); return; }

    const product = new Product(id, name, qty, price);
    inventory.push(product);
    undoStack.push({operation:"add", product});
    saveInventory();
    clearForm();
    alert("Product added!");
}

// Delete Product
function deleteProduct() {
    const id = Number(document.getElementById("productId").value);
    const index = inventory.findIndex(p => p.id === id);
    if (index === -1) { alert("Product not found"); return; }

    undoStack.push({operation:"delete", product: inventory[index]});
    inventory.splice(index, 1);
    saveInventory();
    clearForm();
    alert("Product deleted!");
}

// Update Stock
function updateStock() {
    const id = Number(document.getElementById("productId").value);
    const product = inventory.find(p => p.id === id);
    if (!product) { alert("Product not found"); return; }

    const oldProduct = {...product};
    const qty = Number(document.getElementById("productQty").value);
    if (!qty) { alert("Enter valid quantity"); return; }

    product.quantity = qty;
    undoStack.push({operation:"update", product: oldProduct});
    saveInventory();
    clearForm();
    alert("Stock updated!");
}

// Search Product
function searchProduct() {
    const id = Number(document.getElementById("searchId").value);
    const product = inventory.find(p => p.id === id);
    if (!product) { alert("Product not found"); return; }

    alert(`Found: ${product.name} | Qty: ${product.quantity} | Price: ${product.price.toFixed(2)}`);
}

// Undo Operation
function undoOperation() {
    const last = undoStack.pop();
    if (!last) { alert("Nothing to undo"); return; }

    if (last.operation === "add") {
        inventory = inventory.filter(p => p.id !== last.product.id);
    } else if (last.operation === "delete") {
        inventory.push(last.product);
    } else if (last.operation === "update") {
        const product = inventory.find(p => p.id === last.product.id);
        if (product) product.quantity = last.product.quantity;
    }

    saveInventory();
    alert("Undo done!");
}

// Navigate to inventory page
function goToInventory() {
    saveInventory();
    window.location.href = "inventory.html";
}

function clearForm() {
    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productQty").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("searchId").value = "";
}