"use strict";
//-------------------------------------Skapa en funktion med boolean- se till att det är rätt angiven värde-------------------
function validateInputs(inputs) {
    return !isNaN(inputs.loanAmount) && !isNaN(inputs.interestRate) && !isNaN(inputs.loanTerm);
}
// ---------------------------------------------Annuitetslån formel funktion--------------------------------------------
function calculateMortgage(inputs) {
    if (!validateInputs(inputs)) {
        // returna värdet vid ogiltig data
        return null;
    }
    const { loanAmount, interestRate, loanTerm } = inputs;
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
    let remainingBalance = loanAmount;
    let totalInterest = 0;
    const amortizationSchedule = [];
    for (let month = 1; month <= totalPayments; month++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        totalInterest += interestPayment;
        amortizationSchedule.push({
            month,
            payment: monthlyPayment,
            remainingBalance,
        });
    }
    return { monthlyPayment, totalInterest, amortizationSchedule };
}
// -----------------------------------------Lägg till en funktion som visar resultatet--------------------------------------
function displayResults(result) {
    document.getElementById('monthlyPayment').textContent = result.monthlyPayment.toFixed(2);
    document.getElementById('totalInterest').textContent = result.totalInterest.toFixed(2);
    const amortizationScheduleContainer = document.getElementById('amortizationSchedule');
    amortizationScheduleContainer.innerHTML = '';
    result.amortizationSchedule.forEach((item) => {
        const div = document.createElement('div');
        div.textContent = `Månad ${item.month}: Betalning ${item.payment.toFixed(2)}, Kvarstående Saldo ${item.remainingBalance.toFixed(2)}`;
        amortizationScheduleContainer.appendChild(div);
    });
    // lägg till en getElementById för att visa resultet
    document.getElementById('result-container').classList.remove('hidden');
}
// ----------------------------Skapa en funktion för "button" för att initiera beräkningen-------------------------------------------
function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTerm = parseFloat(document.getElementById('loanTerm').value);
    const inputs = { loanAmount, interestRate, loanTerm };
    const result = calculateMortgage(inputs);
    if (result !== null) {
        displayResults(result);
    }
    else {
        // skapa en alert vid felaktig värdeinmatning
        alert('Ange giltiga värden för lånebelopp, ränta och lånetid.');
    }
}
