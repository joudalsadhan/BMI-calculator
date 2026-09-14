//Set up event listeners once the page DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    //Get references to the buttons and input elements
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn     = document.getElementById('resetBtn');
    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const genderSelect = document.getElementById('gender');
    const weightInput  = document.getElementById('weight');
    const heightInput  = document.getElementById('height');
    const resultDiv    = document.getElementById('result');
    const healthNotesDiv = document.getElementById('healthNotes');

    //Define the fields we’ll validate along with their validation functions
    const fields = [
        { input: nameInput,    errorId: 'error-name',   validate: validateName },
        { input: emailInput,   errorId: 'error-email',  validate: validateEmail },
        { input: genderSelect, errorId: 'error-gender', validate: validateGender },
        { input: weightInput,  errorId: 'error-weight', validate: validateWeight },
        { input: heightInput,  errorId: 'error-height', validate: validateHeight }
    ];

    //For each field: highlight when focused, remove highlight when blur, and validate while typing
    fields.forEach(fieldObj => {
        const field = fieldObj.input;

        field.addEventListener('focus', () => {
            field.parentElement.classList.add('active-field');
        });
        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('active-field');
            fieldObj.validate();
        });
        field.addEventListener('input', () => {
            fieldObj.validate();
        });
    });

    //Update the health notes section whenever gender selection changes
    genderSelect.addEventListener('change', updateHealthNotes);

    //Handle the Calculate BMI button click: validate all and then compute
    calculateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let allValid = true;
        fields.forEach(fieldObj => {
            if (!fieldObj.validate()) {
                allValid = false;
            }
        });
        if (!allValid) return;
        computeResult();
    });

    //Handle the Reset button click: clear form, errors, result and notes
    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetAll();
    });

    //Validation functions

    function validateName() {
        const val = nameInput.value.trim();
        const err = document.getElementById('error-name');
        if (val === '' || !/^[a-zA-Z\s]+$/.test(val)) {
            err.textContent = 'Please enter a valid name (letters and spaces only).';
            nameInput.parentElement.classList.add('error');
            return false;
        } else {
            err.textContent = '';
            nameInput.parentElement.classList.remove('error');
            return true;
        }
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        const err = document.getElementById('error-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val === '' || !emailRegex.test(val)) {
            err.textContent = 'Please enter a valid email.';
            emailInput.parentElement.classList.add('error');
            return false;
        } else {
            err.textContent = '';
            emailInput.parentElement.classList.remove('error');
            return true;
        }
    }

    function validateGender() {
        const val = genderSelect.value;
        const err = document.getElementById('error-gender');
        if (val === '') {
            err.textContent = 'Please select your gender.';
            genderSelect.parentElement.classList.add('error');
            return false;
        } else {
            err.textContent = '';
            genderSelect.parentElement.classList.remove('error');
            return true;
        }
    }

    function validateWeight() {
        const val = parseFloat(weightInput.value);
        const err = document.getElementById('error-weight');
        if (isNaN(val) || val <= 0) {
            err.textContent = 'Please enter a valid weight greater than 0.';
            weightInput.parentElement.classList.add('error');
            return false;
        } else {
            err.textContent = '';
            weightInput.parentElement.classList.remove('error');
            return true;
        }
    }

    function validateHeight() {
        const val = parseFloat(heightInput.value);
        const err = document.getElementById('error-height');
        if (isNaN(val) || val <= 0) {
            err.textContent = 'Please enter a valid height greater than 0.';
            heightInput.parentElement.classList.add('error');
            return false;
        } else {
            err.textContent = '';
            heightInput.parentElement.classList.remove('error');
            return true;
        }
    }

    //Calculates BMI, determines category and displays result with user info
    function computeResult() {
        const name   = nameInput.value.trim();
        const email  = emailInput.value.trim();
        const gender = genderSelect.value;
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);

        const bmiValue = calculateBMI(weight, height).toFixed(2);
        let category = '';
        let categoryClass = '';

        if (bmiValue < 18.5) {
            category       = 'Underweight';
            categoryClass  = 'result-other';
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
            category       = 'Normal weight';
            categoryClass  = 'result-normal';
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
            category       = 'Overweight';
            categoryClass  = 'result-other';
        } else {
            category       = 'Obese';
            categoryClass  = 'result-other';
        }

        resultDiv.innerHTML = `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Gender:</strong> ${gender}</p>
          <p><strong>BMI:</strong> <span class="${categoryClass}">${bmiValue}</span></p>
          <p><strong>Category:</strong> <span class="${categoryClass}">${category}</span></p>
        `;

        updateHealthNotes();
    }

    //Clears everything: inputs, errors, result and health notes
    function resetAll() {
        fields.forEach(fieldObj => {
            fieldObj.input.value = '';
            fieldObj.input.parentElement.classList.remove('error');
            document.getElementById(fieldObj.errorId).textContent = '';
        });
        resultDiv.textContent      = '';
        healthNotesDiv.textContent = '';
    }

    //The core BMI calculation: height in cm  meters, then weight / height²
    function calculateBMI(weightKg, heightCm) {
        const heightM = heightCm / 100;
        return weightKg / (heightM * heightM);
    }

    //Updates the health notes section according to the selected gender
    function updateHealthNotes() {
        const gender = genderSelect.value;
        if (gender === 'Male') {
            healthNotesDiv.innerHTML = `
                <h3>Health Notes (Male)</h3>
                <ul>
                  <li>BMI may not distinguish between muscle and fat mass.</li>
                  <li>Athletic males may have higher BMI but low body fat.</li>
                </ul>`;
        } else if (gender === 'Female') {
            healthNotesDiv.innerHTML = `
                <h3>Health Notes (Female)</h3>
                <ul>
                  <li>Hormonal changes can influence weight and BMI.</li>
                  <li>BMI does not reflect fat distribution (hips vs abdomen).</li>
                </ul>`;
        } else {
            healthNotesDiv.innerHTML = '';
        }
    }
});