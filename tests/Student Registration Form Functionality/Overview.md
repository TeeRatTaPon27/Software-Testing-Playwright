# **Project Overview**

The **Student Registration Form** is a web-based module designed to collect comprehensive student data,
including personal details, contact information, and academic interests. It serves as a practice platform for
verifying form submission logic and UI element interactions.

**As a** potential student
**I want to** fill out the registration form
**So that** I can enroll in the educational program

## **Acceptance Criteria**

1. Verify that a user can successfully submit the form with all valid data.
2. Verify that the form cannot be submitted if mandatory fields (First Name, Last Name, Gender, Mobile)
are blank.
3. Verify that the "City" dropdown options change based on the selected "State".
4. Verify that the "Subjects" field allows multiple entries and displays them as removable tags.
5. Verify that the submission modal correctly displays the exact data entered in the form.
6. Field Validation:
- **6.1 Mobile**: Must be exactly 10 digits. Alphabetic characters or special symbols are not permitted.
- **6.2 Email**: Must contain "@" and a valid domain extension.
- **6.3 Date of Birth**: The field should default to the current system date but allow manual selection via a calendar widget.
7. Dynamic Dropdowns: The "City" dropdown must remain disabled or empty until a "State" is selected.
Upon state selection, only cities belonging to that state shall be displayed.

## **The system shall provide a form containing the following input fields:**

| Field Label      | Element Type     | Data Type / Format                                   |
|------------------|------------------|------------------------------------------------------|
| First Name       | Text Input       | Alphabetic characters                                |
| Last Name        | Text Input       | Alphabetic characters                                |
| Email            | Text Input       | Email format (name@example.com)                      |
| Gender           | Radio Button     | Male, Female, Other (Single selection)               |
| Mobile           | Text Input       | 10-digit numeric value                               |
| Date of Birth    | Date Picker      | Calendar selection (DD MMM YYYY)                     |
| Subjects         | Auto-suggest Text| Multi-select tags (e.g., Maths, Physics)             |
| Hobbies          | Checkbox         | Sports, Reading, Music (Multi-selection)             |
| Picture          | File Upload      | Image files (jpg, png)                               |
| Current Address  | Text Area        | Alphanumeric / Multi-line text                       |
| State            | Dropdown         | Select from list                                     |
| City             | Dropdown         | Select from list (Filtered by State)                 |

## **Submission Process**

- **Submit Button**: Clicking the "Submit" button shall trigger client-side validation.
- **Success Modal**: Upon successful submission, a summary modal titled "Thanks for submitting the
form" shall appear.
- **Data Summary**: The modal shall display a table summarizing all the data entered by the user (Label
vs. Value).
- **Close Modal**: A "Close" button at the bottom of the modal shall return the user to the blank form.