let total = 0;
let expenses = [];
const totalDisplay = document.getElementById("total");
const list = document.getElementById("list");

    function addExpense() {
        const desc = document.getElementById("desc").value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (desc === "" || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid description and amount.");
            return;
        }

        const expense = { id: Date.now(), desc, amount };
        expenses.push(expense);
        total += amount;
        updateUI();

        document.getElementById("desc").value = "";
        document.getElementById("amount").value = "";
        }

        function updateUI() {
            list.innerHTML = "";
            total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            totalDisplay.textContent = total.toFixed(2);

            expenses.forEach(expense => {
                const li = document.createElement("li");
                li.innerHTML = `
                    ${expense.desc}: $${expense.amount.toFixed(2)}
                    <button onclick="editExpense(${expense.id})">Edit</button>
                    <button onclick="deleteExpense(${expense.id})">Delete</button>
                `;
                list.appendChild(li);
            });
        }

        function editExpense(id) {
            const expense = expenses.find(exp => exp.id === id);
            if (expense) {
                document.getElementById("desc").value = expense.desc;
                document.getElementById("amount").value = expense.amount;
                deleteExpense(id);
            }
        }

        function deleteExpense(id) {
            expenses = expenses.filter(exp => exp.id !== id);
            updateUI();
        }

        function clearExpenses() {
            expenses = [];
            total = 0;
            updateUI();
        }