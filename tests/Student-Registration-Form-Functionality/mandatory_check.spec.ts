import { test, expect } from '@playwright/test';

test.describe('การตรวจสอบฟิลด์บังคับ (Mandatory Field Validation - Negative Testing)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
  });

  test('TC-MAN-01: ไม่สามารถส่งฟอร์มได้หากเว้นว่างทุกฟิลด์', async ({ page }) => {
    // Act: กดปุ่ม Submit ทันทีโดยไม่กรอกอะไรเลย
    await page.locator('#submit').click({ force: true });

    // Assert 1: ต้องไม่มี Modal ความสำเร็จเด้งขึ้นมา
    await expect(page.locator('.modal-content')).not.toBeVisible();

    // Assert 2: ตรวจสอบว่าเบราว์เซอร์มองว่าช่อง First Name "ไม่ถูกต้อง" (HTML5 Validation)
    const isFirstNameValid = await page.locator('#firstName').evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isFirstNameValid).toBe(false);
  });

  test('TC-MAN-02: ไม่สามารถส่งฟอร์มได้หากขาด First Name', async ({ page }) => {
    // Arrange: กรอกข้อมูลฟิลด์บังคับอื่นให้ครบ ยกเว้น First Name
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByText('Male', { exact: true }).click();
    await page.getByPlaceholder('Mobile Number').fill('0812345678');

    // Act: กด Submit
    await page.locator('#submit').click({ force: true });

    // Assert: Modal ต้องไม่ขึ้น และ First Name ต้องขึ้นกรอบสีแดง (Bootstrap Invalid Color)
    await expect(page.locator('.modal-content')).not.toBeVisible();
    await expect(page.locator('#firstName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

  test('TC-MAN-03: ไม่สามารถส่งฟอร์มได้หากขาด Last Name', async ({ page }) => {
    // Arrange: กรอกข้อมูลยกเว้น Last Name
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByText('Male', { exact: true }).click();
    await page.getByPlaceholder('Mobile Number').fill('0812345678');

    // Act
    await page.locator('#submit').click({ force: true });

    // Assert
    await expect(page.locator('.modal-content')).not.toBeVisible();
    await expect(page.locator('#lastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

  test('TC-MAN-04: ไม่สามารถส่งฟอร์มได้หากไม่ได้เลือก Gender', async ({ page }) => {
    // Arrange: กรอก First, Last, Mobile แต่ไม่กดเลือกเพศ
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByPlaceholder('Mobile Number').fill('0812345678');

    // Act
    await page.locator('#submit').click({ force: true });

    // Assert
    await expect(page.locator('.modal-content')).not.toBeVisible();
    
    // เพศเป็น Radio Button พิเศษใน DemoQA ให้เช็คที่ตัว Wrapper ว่าฟอร์มโดยรวมติด validation
    const form = page.locator('#userForm');
    await expect(form).toHaveClass(/was-validated/);
  });

  test('TC-MAN-05: ไม่สามารถส่งฟอร์มได้หากขาด Mobile Number', async ({ page }) => {
    // Arrange: กรอกข้อมูลยกเว้นเบอร์มือถือ
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByText('Male', { exact: true }).click();

    // Act
    await page.locator('#submit').click({ force: true });

    // Assert
    await expect(page.locator('.modal-content')).not.toBeVisible();
    await expect(page.locator('#userNumber')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

});