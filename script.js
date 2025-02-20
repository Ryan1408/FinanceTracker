document.addEventListener("DOMContentLoaded", loadExpenses);
document.addEventListener("DOMContentLoaded", loadIncome);
document.addEventListener("DOMContentLoaded", loadSavings);
document.addEventListener("DOMContentLoaded", calculateBalance);
document.addEventListener("DOMContentLoaded", checkStartingBalance);
document.addEventListener("DOMContentLoaded", checkDarkMode);

const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalExpenses = document.getElementById("total-expenses");
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const incomeForm = document.getElementById("income-form");
const incomeList = document.getElementById("income-list");
const totalIncome = document.getElementById("total-income");
let incomes = JSON.parse(localStorage.getItem("income")) || [];

const savingsForm = document.getElementById("savings-form");
const savingsList = document.getElementById("savings-list");
const totalSavings = document.getElementById("total-savings");
let savings = JSON.parse(localStorage.getItem("savings")) || [];

const balanceForm = document.getElementById("balance-form");
const balanceElement = document.getElementById("balance");
let startingBalance = parseFloat(localStorage.getItem("startingBalance")) || 0;

balanceForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const balance = document.getElementById("starting-balance").value;

    if (balance) {
        startingBalance = parseFloat(balance);
        localStorage.setItem("startingBalance", startingBalance);
        calculateBalance();
        hideStartingWrapper();
    }
});

function hideStartingWrapper() {
    document.getElementById("starting-wrapper").style.display = "none";
}

function checkStartingBalance() {
    if (startingBalance > 0) {
        hideStartingWrapper();
    }
}

expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("expense-name").value;
    const amount = document.getElementById("expense-amount").value;

    if (name && amount) {
        const expense = {
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            date: new Date().toLocaleDateString()
        };
        expenses.push(expense);
        saveExpenses();
        renderExpenses();
        expenseForm.reset();
        calculateBalance();
    }
});

function renderExpenses() {
    expenseList.innerHTML = "";
    let total = 0;

    expenses.forEach(expense => {
        total += expense.amount;
        const li = document.createElement("li");
        li.innerHTML = `${expense.name} - £${expense.amount} <span class="date">${expense.date}</span> <button class="deleteButton" onclick="deleteExpense(${expense.id})">x</button>`;
        expenseList.appendChild(li);
    });

    totalExpenses.textContent = total.toFixed(2); //rounds to 2 decimal places
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    renderExpenses();
    calculateBalance();
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
    renderExpenses();
}


// income
incomeForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("income-name").value;
    const amount = document.getElementById("income-amount").value;

    if (name && amount) {
        const income = {
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            date: new Date().toLocaleDateString()
        };
        incomes.push(income);
        saveIncome();
        renderIncome();
        incomeForm.reset();
        calculateBalance();
    }
});

function renderIncome() {
    incomeList.innerHTML = "";
    let total = 0;

    incomes.forEach(income => {
        total += income.amount;
        const li = document.createElement("li");
        li.innerHTML = `${income.name} - £${income.amount} <span class="date">${income.date}</span> <button class="deleteButton" onclick="deleteIncome(${income.id})">x</button>`;
        incomeList.appendChild(li);
    });

    totalIncome.textContent = total.toFixed(2); //rounds to 2 decimal places
}

function deleteIncome(id) {
    incomes = incomes.filter(income => income.id !== id);
    saveIncome();
    renderIncome();
    calculateBalance();
}

function saveIncome() {
    localStorage.setItem("income", JSON.stringify(incomes));
}

function loadIncome() {
    renderIncome();
}


// savings
savingsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const amount = document.getElementById("savings-amount").value;

    if (amount) {
        const saving = {
            id: Date.now(),
            amount: parseFloat(amount),
            date: new Date().toLocaleDateString()
        };
        savings.push(saving);
        saveSavings();
        renderSavings();
        savingsForm.reset();
        calculateBalance();
    }
});

function renderSavings() {
    savingsList.innerHTML = "";
    let total = 0;

    savings.forEach(saving => {
        total += saving.amount;
        const li = document.createElement("li");
        li.innerHTML = `£${saving.amount} <span class="date">${saving.date}</span> <button class="deleteButton" onclick="deleteSaving(${saving.id})">x</button>`;
        savingsList.appendChild(li);
    });

    totalSavings.textContent = total.toFixed(2); //rounds to 2 decimal places
}

function deleteSaving(id) {
    savings = savings.filter(saving => saving.id !== id);
    saveSavings();
    renderSavings();
    calculateBalance();
}

function saveSavings() {
    localStorage.setItem("savings", JSON.stringify(savings));
}

function loadSavings() {
    renderSavings();
}


// balance
function calculateBalance() {
    const totalIncomeValue = incomes.reduce((acc, income) => acc + income.amount, 0);
    const totalExpenseValue = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const totalSavingsValue = savings.reduce((acc, saving) => acc + saving.amount, 0);
    const startingValue = startingBalance;

    const balance = totalIncomeValue - totalExpenseValue - totalSavingsValue + startingValue;
    balanceElement.textContent = balance.toFixed(2); //rounds to 2 decimal places
}

// Toggle settings menu 
const settingsButton = document.getElementById("settings-button");
const settingsMenu = document.getElementById("settings-menu");

settingsButton.addEventListener("click", function() {
    if (settingsMenu.style.display === "none" || settingsMenu.style.display === "") {
        settingsMenu.style.display = "block";
    } else {
        settingsMenu.style.display = "none";
    }
});

// Close settings menu
const closeButton = document.getElementById("close-button");

closeButton.addEventListener("click", function() {
    settingsMenu.style.display = "none";
});

// Close settings menu when clicking outside
document.addEventListener("click", function(event) {
    if (!settingsMenu.contains(event.target) && !settingsButton.contains(event.target)) {
        settingsMenu.style.display = "none";
    }
});

// Toggle dark mode
const darkModeButton = document.getElementById("dark-mode-button");

darkModeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        container.classList.toggle('dark-mode');
    });
    // saving preference
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});

function checkDarkMode() {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        document.body.classList.add("dark-mode");
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.classList.add('dark-mode');
        });
    }
}

// reset all data
const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", function() {
    expenses = [];
    incomes = [];
    savings = [];
    startingBalance = 0;
    localStorage.removeItem("expenses");
    localStorage.removeItem("income");
    localStorage.removeItem("savings");
    localStorage.removeItem("startingBalance");
    renderExpenses();
    renderIncome();
    renderSavings();
    calculateBalance();
    settingsMenu.style.display = "none"; // Hide the settings menu after resetting
    location.reload();
});
