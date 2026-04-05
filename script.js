

// ========== GLOBAL VARIABLES ==========
var studentRecords = [];       // array to store student objects
var editingId = null;          // holds the ID of student being edited (null if add mode)

// DOM elements
var studentNameInput = document.getElementById('studentName');
var studentIdInput = document.getElementById('studentId');
var emailInput = document.getElementById('emailId');
var contactInput = document.getElementById('contactNo');
var addButton = document.getElementById('addBtn');
var cancelButton = document.getElementById('cancelBtn');
var tableBody = document.getElementById('tableBody');
var recordsContainer = document.getElementById('recordsContainer');

// Error spans
var nameError = document.getElementById('nameError');
var idError = document.getElementById('idError');
var emailError = document.getElementById('emailError');
var contactError = document.getElementById('contactError');

// ========== HELPER: LOAD DATA FROM LOCALSTORAGE ==========
function loadFromLocalStorage() {
    var storedData = localStorage.getItem('studentRecords');
    if (storedData === null) {
        studentRecords = [];
    } else {
        studentRecords = JSON.parse(storedData);
    }
}

// ========== HELPER: SAVE DATA TO LOCALSTORAGE ==========
function saveToLocalStorage() {
    localStorage.setItem('studentRecords', JSON.stringify(studentRecords));
}

// ========== DYNAMIC VERTICAL SCROLLBAR (Task 6) ==========
function updateScrollbarDynamically() {
    var recordCount = studentRecords.length;
    // Apply vertical scrollbar only when more than 3 records to keep interface clean
    if (recordCount > 3) {
        recordsContainer.style.maxHeight = '350px';
        recordsContainer.style.overflowY = 'auto';
        recordsContainer.style.border = '1px solid #e2e8f0';
        recordsContainer.style.borderRadius = '12px';
    } else {
        recordsContainer.style.maxHeight = 'none';
        recordsContainer.style.overflowY = 'visible';
        recordsContainer.style.border = 'none';
    }
}

// ========== DISPLAY RECORDS IN TABLE ==========
function displayRecords() {
    // Clear table body except header remains via thead
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    
    if (studentRecords.length === 0) {
        var emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-row';
        var emptyCell = document.createElement('td');
        emptyCell.setAttribute('colspan', '5');
        emptyCell.textContent = 'No records found. Add a student.';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
    } else {
        for (var i = 0; i < studentRecords.length; i++) {
            var record = studentRecords[i];
            var row = document.createElement('tr');
            
            // Name cell
            var nameCell = document.createElement('td');
            nameCell.textContent = record.name;
            row.appendChild(nameCell);
            
            // ID cell
            var idCell = document.createElement('td');
            idCell.textContent = record.id;
            row.appendChild(idCell);
            
            // Email cell
            var emailCell = document.createElement('td');
            emailCell.textContent = record.email;
            row.appendChild(emailCell);
            
            // Contact cell
            var contactCell = document.createElement('td');
            contactCell.textContent = record.contact;
            row.appendChild(contactCell);
            
            // Actions cell with Edit and Delete buttons
            var actionsCell = document.createElement('td');
            var btnContainer = document.createElement('div');
            btnContainer.className = 'action-buttons';
            
            var editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'btn btn-warning';
            // Store the student ID to use in event listener
            editBtn.setAttribute('data-id', record.id);
            
            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-danger';
            deleteBtn.setAttribute('data-id', record.id);
            
            // Add event listeners using traditional functions (no arrow)
            editBtn.addEventListener('click', function(event) {
                var studentIdToEdit = event.currentTarget.getAttribute('data-id');
                editRecord(studentIdToEdit);
            });
            
            deleteBtn.addEventListener('click', function(event) {
                var studentIdToDelete = event.currentTarget.getAttribute('data-id');
                deleteRecord(studentIdToDelete);
            });
            
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            actionsCell.appendChild(btnContainer);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        }
    }
    
    // After displaying, update vertical scrollbar
    updateScrollbarDynamically();
}

// ========== VALIDATION FUNCTION (returns true if valid, false otherwise) ==========
function validateForm() {
    var isValid = true;
    
    // Clear all previous errors
    nameError.textContent = '';
    idError.textContent = '';
    emailError.textContent = '';
    contactError.textContent = '';
    
    // 1. Student Name: only letters and spaces, not empty
    var nameValue = studentNameInput.value.trim();
    if (nameValue === '') {
        nameError.textContent = 'Student name is required.';
        isValid = false;
    } else {
        var namePattern = /^[A-Za-z\s]+$/;
        if (namePattern.test(nameValue) === false) {
            nameError.textContent = 'Name must contain only letters and spaces.';
            isValid = false;
        }
    }
    
    // 2. Student ID: only numbers, not empty, and check uniqueness later in add/update
    var idValue = studentIdInput.value.trim();
    if (idValue === '') {
        idError.textContent = 'Student ID is required.';
        isValid = false;
    } else {
        var idPattern = /^\d+$/;
        if (idPattern.test(idValue) === false) {
            idError.textContent = 'Student ID must contain only numbers.';
            isValid = false;
        }
    }
    
    // 3. Email: valid email format
    var emailValue = emailInput.value.trim();
    if (emailValue === '') {
        emailError.textContent = 'Email address is required.';
        isValid = false;
    } else {
        var emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (emailPattern.test(emailValue) === false) {
            emailError.textContent = 'Enter a valid email address (e.g., name@domain.com).';
            isValid = false;
        }
    }
    
    // 4. Contact Number: only numbers, at least 10 digits
    var contactValue = contactInput.value.trim();
    if (contactValue === '') {
        contactError.textContent = 'Contact number is required.';
        isValid = false;
    } else {
        var contactPattern = /^\d+$/;
        if (contactPattern.test(contactValue) === false) {
            contactError.textContent = 'Contact number must contain only digits.';
            isValid = false;
        } else if (contactValue.length < 10) {
            contactError.textContent = 'Contact number must be at least 10 digits.';
            isValid = false;
        }
    }
    
    return isValid;
}

// ========== RESET FORM (clear fields and exit edit mode) ==========
function resetForm() {
    studentNameInput.value = '';
    studentIdInput.value = '';
    emailInput.value = '';
    contactInput.value = '';
    editingId = null;
    addButton.textContent = 'Add Student';
    // Clear all error messages
    nameError.textContent = '';
    idError.textContent = '';
    emailError.textContent = '';
    contactError.textContent = '';
}

// ========== ADD OR UPDATE RECORD ==========
function addOrUpdateRecord() {
    // First validate form
    if (validateForm() === false) {
        return;  // stop if validation fails
    }
    
    var nameValue = studentNameInput.value.trim();
    var idValue = studentIdInput.value.trim();
    var emailValue = emailInput.value.trim();
    var contactValue = contactInput.value.trim();
    
    // Check for duplicate ID (if adding new or editing with changed ID)
    var duplicateFound = false;
    if (editingId === null) {
        // ADD mode: check if ID already exists
        for (var i = 0; i < studentRecords.length; i++) {
            if (studentRecords[i].id === idValue) {
                duplicateFound = true;
                break;
            }
        }
        if (duplicateFound === true) {
            idError.textContent = 'Student ID already exists. Use a unique ID.';
            return;
        }
    } else {
        // EDIT mode: check if the new ID is already used by ANOTHER record (not the one being edited)
        for (var j = 0; j < studentRecords.length; j++) {
            if (studentRecords[j].id === idValue && studentRecords[j].id !== editingId) {
                duplicateFound = true;
                break;
            }
        }
        if (duplicateFound === true) {
            idError.textContent = 'Student ID already exists. Cannot change to this ID.';
            return;
        }
    }
    
    if (editingId === null) {
        // ========== ADD NEW RECORD ==========
        var newStudent = {
            name: nameValue,
            id: idValue,
            email: emailValue,
            contact: contactValue
        };
        studentRecords.push(newStudent);
        saveToLocalStorage();
        displayRecords();
        resetForm();
    } else {
        // ========== UPDATE EXISTING RECORD ==========
        for (var k = 0; k < studentRecords.length; k++) {
            if (studentRecords[k].id === editingId) {
                studentRecords[k].name = nameValue;
                studentRecords[k].id = idValue;
                studentRecords[k].email = emailValue;
                studentRecords[k].contact = contactValue;
                break;
            }
        }
        saveToLocalStorage();
        displayRecords();
        resetForm();  // clears editing mode
    }
}

// ========== EDIT RECORD (populate form and set editing mode) ==========
function editRecord(studentId) {
    var recordToEdit = null;
    for (var i = 0; i < studentRecords.length; i++) {
        if (studentRecords[i].id === studentId) {
            recordToEdit = studentRecords[i];
            break;
        }
    }
    
    if (recordToEdit !== null) {
        // Fill form with existing data
        studentNameInput.value = recordToEdit.name;
        studentIdInput.value = recordToEdit.id;
        emailInput.value = recordToEdit.email;
        contactInput.value = recordToEdit.contact;
        
        // Set editingId to the original ID
        editingId = recordToEdit.id;
        addButton.textContent = 'Update Student';
        
        // Clear any previous errors
        nameError.textContent = '';
        idError.textContent = '';
        emailError.textContent = '';
        contactError.textContent = '';
    }
}

// ========== DELETE RECORD (with confirmation) ==========
function deleteRecord(studentId) {
    var confirmResult = confirm('Are you sure you want to delete this student record?');
    if (confirmResult === true) {
        var newRecords = [];
        for (var i = 0; i < studentRecords.length; i++) {
            if (studentRecords[i].id !== studentId) {
                newRecords.push(studentRecords[i]);
            }
        }
        studentRecords = newRecords;
        saveToLocalStorage();
        displayRecords();
        
        // If we were editing the deleted record, reset form
        if (editingId === studentId) {
            resetForm();
        }
    }
}

// ========== INITIALIZE APPLICATION ==========
function init() {
    loadFromLocalStorage();
    displayRecords();
    
    // Add event listeners (no arrow functions)
    addButton.addEventListener('click', function() {
        addOrUpdateRecord();
    });
    
    cancelButton.addEventListener('click', function() {
        resetForm();
    });
}

// Start the application when page loads
window.addEventListener('load', init);