import { test, expect } from '@playwright/test';

test.describe('การตรวจสอบฟิลด์บังคับ (Mandatory Field Validation - Negative Testing)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: '#fixedban, footer { display: none !important; }' });
  });

  test('TC-MAN-01: ไม่สามารถส่งฟอร์มได้หากเว้นว่างทุกฟิลด์', async ({ page }) => {
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('.modal-content')).not.toBeVisible();
    const isFirstNameValid = await page.locator('#firstName').evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isFirstNameValid).toBe(false);
  });

  test('TC-MAN-02: ไม่สามารถส่งฟอร์มได้หากขาด First Name', async ({ page }) => {
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByText('Male', { exact: true }).click({ force: true });
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('.modal-content')).not.toBeVisible();
    await expect(page.locator('#firstName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

  test('TC-MAN-03: ไม่สามารถส่งฟอร์มได้หากขาด Last Name', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByText('Male', { exact: true }).click({ force: true });
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('.modal-content')).not.toBeVisible();
    await expect(page.locator('#lastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

  test('TC-MAN-04: ไม่สามารถส่งฟอร์มได้หากไม่ได้เลือก Gender', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('.modal-content')).not.toBeVisible();
    const form = page.locator('#userForm');
    await expect(form).toHaveClass(/was-validated/);
  });

  test('TC-MAN-05: ไม่สามารถส่งฟอร์มได้หากขาด Mobile Number', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByText('Male', { exact: true }).click({ force: true });
    await page.locator('#submit').click({ force: true });
    await expect(page.locator('.modal-content')).not.toBeVisible();
    await expect(page.locator('#userNumber')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

});