



```markdown
# Student Registration System

A fully responsive web application for managing student records – add, edit, delete, and persistent storage using the browser's localStorage. Built with plain HTML, CSS, and JavaScript
## Features

- **Add Student** – Register a student with name, ID, email, and contact number.
- **Edit Student** – Update any existing record; the form pre‑fills with current data.
- **Delete Student** – Remove a record after a confirmation dialog.
- **Data Persistence** – All records are saved to `localStorage` and survive page reloads.
- **Form Validation** (real‑time on submit)
  - Name: letters and spaces only, not empty.
  - Student ID: numbers only, must be unique.
  - Email: valid email format.
  - Contact number: numbers only, minimum 10 digits.
- **Dynamic Vertical Scrollbar** – Appears automatically when more than 3 records are added.
- **Responsive Design** – Optimised for mobile (≤640px), tablet (641px–1024px), and desktop (≥1025px).

## Technologies Used

- HTML5 (semantic elements)
- CSS3 (flexbox, media queries, gradients)
- Vanilla JavaScript (ES5 style – no arrow functions, no `!`, no ternary, only `var`)

## File Structure



## How to Run

1. Clone the repository or download the ZIP.
2. Open `index.html` in any modern web browser.
3. No server, build tools, or dependencies required.

## Usage

1. Fill in the student details in the form.
2. Click **Add Student** to register.
3. To edit: click **Edit** next to any record → modify fields → click **Update Student**.
4. To delete: click **Delete** and confirm.
5. Use **Cancel** to clear the form and exit edit mode.

## Coding Conventions Followed

- No arrow functions – all callbacks use the `function` keyword.
- No logical NOT (`!`) – explicit comparisons like `errorFlag === false`.
- No ternary operators – full `if-else` statements.
- All variables declared with `var`.

## GitHub Repository

[https://github.com/yA-005/student-registration-system](https://github.com/yA-005/student-registration-system)

## Author

GitHub: [yA-005](https://github.com/yA-005)

## License

Free for educational use.
```

---



```bash

```