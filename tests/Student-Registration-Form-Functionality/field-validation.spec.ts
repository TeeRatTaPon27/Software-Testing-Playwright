import { test, expect } from '@playwright/test';

test.describe('การตรวจสอบความถูกต้องของฟิลด์ (Field Validation - BVA & EP)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string, { waitUntil: 'domcontentloaded' });
    
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByText('Male', { exact: true }).click({ force: true });
  });

  test('TC-BVA-01: Lower Bound (9 หลัก) - ต้องติด Invalid Validation', async ({ page }) => {
    const mobileInput = page.getByPlaceholder('Mobile Number');
    await mobileInput.fill('081234567');
    await mobileInput.press('Tab');
    await page.locator('#submit').click({ force: true });

    const isValid = await mobileInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('TC-BVA-02: On Point (10 หลัก) - ต้องผ่านและส่งฟอร์มสำเร็จ', async ({ page }) => {
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('TC-BVA-03: Upper Bound (11 หลัก) - ระบบต้องตัดทิ้งเหลือแค่ 10 หลัก (Max Length)', async ({ page }) => {
    const mobileInput = page.getByPlaceholder('Mobile Number');
    await mobileInput.fill('08123456789');
    await expect(mobileInput).toHaveValue('0812345678');
  });

  test('TC-BVA-04: Invalid Characters - ระบบต้องติด Validation สีแดงเมื่อกรอกตัวอักษร', async ({ page }) => {
    const mobileInput = page.getByPlaceholder('Mobile Number');
    await mobileInput.fill('abcdefghij');
    await mobileInput.press('Tab');
    await page.locator('#submit').click({ force: true });
    
    await expect(mobileInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('TC-EP-01: Invalid Email (ขาดสัญลักษณ์ @) - ต้องติด Invalid Validation', async ({ page }) => {
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    const emailInput = page.getByPlaceholder('name@example.com');
    await emailInput.fill('teestudent.chula.ac.th');
    await emailInput.press('Tab');
    
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('#userEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

  test('TC-EP-02: Invalid Email (ขาด Domain) - ต้องติด Invalid Validation', async ({ page }) => {
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    const emailInput = page.getByPlaceholder('name@example.com');
    await emailInput.fill('tee@');
    await emailInput.press('Tab');
    
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('#userEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

});