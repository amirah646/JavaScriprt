// DOM Elements
const expenseForm = document.getElementById("expense-form")
const expenseNameInput = document.getElementById("expense-name")
const expenseAmountInput = document.getElementById("expense-amount")
const expensesList = document.getElementById("expenses-list")
const totalAmountElement = document.getElementById("total-amount")
const noExpensesMessage = document.getElementById("no-expenses-message")
const editModal = document.getElementById("edit-modal")
const closeModalBtn = document.querySelector(".close")
const editForm = document.getElementById("edit-form")
const editIdInput = document.getElementById("edit-id")
const editNameInput = document.getElementById("edit-name")
const editAmountInput = document.getElementById("edit-amount")

// Expenses array
let expenses = JSON.parse(localStorage.getItem("expenses")) || []

// Initialize the app
function init() {
  renderExpenses()
  updateTotal()
}

// Save expenses to localStorage
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses))
}

// Add a new expense
function addExpense(name, amount) {
  const expense = {
    id: Date.now().toString(),
    name,
    amount: Number.parseFloat(amount),
  }

  expenses.push(expense)
  saveExpenses()
  renderExpenses()
  updateTotal()
}

// Delete an expense
function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id)
  saveExpenses()
  renderExpenses()
  updateTotal()
}

// Edit an expense
function editExpense(id, name, amount) {
  const index = expenses.findIndex((expense) => expense.id === id)
  if (index !== -1) {
    expenses[index].name = name
    expenses[index].amount = Number.parseFloat(amount)
    saveExpenses()
    renderExpenses()
    updateTotal()
  }
}

// Open edit modal
function openEditModal(id) {
  const expense = expenses.find((expense) => expense.id === id)
  if (expense) {
    editIdInput.value = expense.id
    editNameInput.value = expense.name
    editAmountInput.value = expense.amount
    editModal.style.display = "block"
  }
}

// Close edit modal
function closeEditModal() {
  editModal.style.display = "none"
}

// Render expenses list
function renderExpenses() {
  expensesList.innerHTML = ""

  if (expenses.length === 0) {
    noExpensesMessage.style.display = "block"
    return
  }

  noExpensesMessage.style.display = "none"

  expenses.forEach((expense) => {
    const row = document.createElement("tr")

    const nameCell = document.createElement("td")
    nameCell.textContent = expense.name

    const amountCell = document.createElement("td")
    amountCell.textContent = `$${expense.amount.toFixed(2)}`

    const actionsCell = document.createElement("td")

    const editButton = document.createElement("button")
    editButton.textContent = "Edit"
    editButton.classList.add("action-btn", "edit-btn")
    editButton.addEventListener("click", () => openEditModal(expense.id))

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("action-btn", "delete-btn")
    deleteButton.addEventListener("click", () => deleteExpense(expense.id))

    actionsCell.appendChild(editButton)
    actionsCell.appendChild(deleteButton)

    row.appendChild(nameCell)
    row.appendChild(amountCell)
    row.appendChild(actionsCell)

    expensesList.appendChild(row)
  })
}

// Update total amount
function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  totalAmountElement.textContent = `$${total.toFixed(2)}`
}

// Event Listeners
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const name = expenseNameInput.value.trim()
  const amount = expenseAmountInput.value

  if (name && amount) {
    addExpense(name, amount)
    expenseNameInput.value = ""
    expenseAmountInput.value = ""
  }
})

editForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const id = editIdInput.value
  const name = editNameInput.value.trim()
  const amount = editAmountInput.value

  if (id && name && amount) {
    editExpense(id, name, amount)
    closeEditModal()
  }
})

closeModalBtn.addEventListener("click", closeEditModal)

window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    closeEditModal()
  }
})

// Initialize the app
init()

