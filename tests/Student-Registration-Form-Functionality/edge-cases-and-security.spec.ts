import { test, expect } from '@playwright/test';

test.describe('การทดสอบกรณีขอบข่ายและความปลอดภัย (Edge Cases & Security)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: '#fixedban, footer { display: none !important; }' });
    
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('CEDT');
    await page.getByText('Male', { exact: true }).click({ force: true }); 
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
  });

  test('TC-EDGE-01: ระบบต้องจัดการกับการอัปโหลดไฟล์ที่ไม่ใช่รูปภาพ (เช่น .txt) ได้อย่างถูกต้อง', async ({ page }) => {
    await page.locator('#uploadPicture').setInputFiles({
      name: 'malicious-script.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a text file, not an image.')
    });
    
    await page.locator('#submit').click({ force: true });

    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('tbody tr:has-text("Picture")')).toContainText('malicious-script.txt'); 
  });

  test('TC-SEC-01: ตรวจสอบการทำ Sanitization ในฟิลด์ Address ป้องกัน Cross-Site Scripting (XSS)', async ({ page }) => {
    const xssPayload = "<script>alert('You have been hacked!')</script>";
    
    let isAlertTriggered = false;
    page.on('dialog', async (dialog) => {
      isAlertTriggered = true;
      await dialog.dismiss();
    });

    await page.getByPlaceholder('Current Address').fill(xssPayload);
    await page.locator('#submit').click({ force: true });

    await expect(page.locator('.modal-content')).toBeVisible();
    expect(isAlertTriggered).toBe(false);
    await expect(page.locator('tbody tr:has-text("Address")')).toContainText(xssPayload);
  });

  test('TC-EDGE-02: ฟิลด์ Email ต้องรองรับรูปแบบที่ซับซ้อนแต่ถูกต้องตามมาตรฐาน (Deep EP)', async ({ page }) => {
    const complexEmail = 'tee.cedt_qa-test@sub-domain.co.th';
    
    const emailInput = page.getByPlaceholder('name@example.com');
    await emailInput.fill(complexEmail);
    await emailInput.press('Tab'); 
    
    await page.locator('#submit').click({ force: true });

    await expect(page.locator('#userEmail')).not.toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('tbody tr:has-text("Student Email")')).toContainText(complexEmail);
  });

});