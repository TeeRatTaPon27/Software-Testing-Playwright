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

## **Testing Techniques Applied**
- **Boundary Value Analysis (BVA):** ใช้ตรวจสอบช่อง Mobile Number (9, 10, 11 หลัก) และความยาวของอักขระ
- **Equivalence Partitioning (EP):** ใช้ตรวจสอบรูปแบบของ Email และประเภทไฟล์ที่อัปโหลด
- **Decision Table Testing:** ตรวจสอบความสัมพันธ์ระหว่าง State และ City

## **Test Suite Structure**
1. `positive_submission.spec.ts`: ทดสอบการกรอกข้อมูลสำเร็จและตรวจสอบ Modal
2. `field_validation.spec.ts`: ทดสอบ BVA/EP ของ Mobile และ Email
3. `dynamic_elements.spec.ts`: ทดสอบ State/City Dropdown และ Subjects Tags
4. `mandatory_check.spec.ts`: ทดสอบการไม่กรอกฟิลด์บังคับ

## **All scenario in testing**

| Test Suite (ชื่อไฟล์)              | Test Case ID | รายละเอียดสคริปต์ทดสอบ (Scenario Description)                                                                 | เทคนิคที่ใช้ (QA Technique)                                  |
|-------------------------------------|-------------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| positive_submission.spec.ts         | TC-POS-01   | กรอกข้อมูลถูกต้องและครบถ้วนทุกฟิลด์ ต้องสามารถส่งฟอร์มได้และแสดง Modal สรุปข้อมูลที่ตรงกับความเป็นจริง | Positive Testing (Happy Path)                                |
| mandatory_check.spec.ts             | TC-MAN-01   | ไม่สามารถส่งฟอร์มได้ หากกด Submit ทันทีโดยไม่กรอกข้อมูลใดๆ เลย                                              | Negative Testing                                             |
| mandatory_check.spec.ts             | TC-MAN-02   | ไม่สามารถส่งฟอร์มได้ หากเว้นว่างช่อง First Name                                                              | Negative Testing                                             |
| mandatory_check.spec.ts             | TC-MAN-03   | ไม่สามารถส่งฟอร์มได้ หากเว้นว่างช่อง Last Name                                                               | Negative Testing                                             |
| mandatory_check.spec.ts             | TC-MAN-04   | ไม่สามารถส่งฟอร์มได้ หากไม่ได้เลือก Gender                                                                    | Negative Testing                                             |
| mandatory_check.spec.ts             | TC-MAN-05   | ไม่สามารถส่งฟอร์มได้ หากเว้นว่างช่อง Mobile Number                                                           | Negative Testing                                             |
| field-validation.spec.ts            | TC-BVA-01   | กรอกเบอร์มือถือ 9 หลัก ต้องขึ้นแจ้งเตือน Invalid และส่งไม่ผ่าน                                               | Boundary Value Analysis (BVA) - Lower Bound                  |
| field-validation.spec.ts            | TC-BVA-02   | กรอกเบอร์มือถือ 10 หลักเป๊ะ ต้องตรวจสอบผ่าน                                                                  | Boundary Value Analysis (BVA) - On Point                     |
| field-validation.spec.ts            | TC-BVA-03   | กรอกเบอร์มือถือ 11 หลัก ระบบต้องจำกัดความยาว (Max Length) ให้พิมพ์ได้แค่ 10 หลัก                          | Boundary Value Analysis (BVA) - Upper Bound                  |
| field-validation.spec.ts            | TC-BVA-04   | พยายามกรอกตัวอักษรลงในช่องเบอร์มือถือ ระบบต้องขึ้นแจ้งเตือน Invalid เมื่อส่งฟอร์ม                         | Error Guessing / Behavior Testing                            |
| field-validation.spec.ts            | TC-EP-01    | กรอกอีเมลผิดรูปแบบ (ขาดเครื่องหมาย @) ต้องขึ้นแจ้งเตือน Invalid                                             | Equivalence Partitioning (EP) - Invalid Class                |
| field-validation.spec.ts            | TC-EP-02    | กรอกอีเมลผิดรูปแบบ (ขาด Domain Name เช่น test@) ต้องขึ้นแจ้งเตือน Invalid                                   | Equivalence Partitioning (EP) - Invalid Class                |
| dynamic-and-complex-ui.spec.ts      | TC-DYN-01   | ตัวเลือกใน Dropdown City ต้องถูกจำกัดให้สอดคล้องกับ State ที่เลือกในปัจจุบันเท่านั้น                        | Decision Table / Logic Testing                               |
| dynamic-and-complex-ui.spec.ts      | TC-DYN-02   | ฟิลด์ Subjects ต้องพิมพ์ค้นหาได้ เลือกได้หลายวิชา (แสดงเป็น Tags) และกดกากบาทลบออกได้                      | UI Interaction Testing                                       |
| dynamic-and-complex-ui.spec.ts      | TC-DYN-03   | ปฏิทิน Date of Birth ต้องแสดงวันปัจจุบันเป็นค่า Default และสามารถกดเปิดเพื่อเปลี่ยนวันที่ได้                | Functional / Component Testing                               |