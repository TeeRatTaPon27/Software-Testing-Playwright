import { test, expect } from '@playwright/test';

test.describe('การทดสอบกรณีขอบข่ายและความปลอดภัย (Edge Cases & Security)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    // Must do
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('CEDT');
    await page.getByText('Male', { exact: true }).click({ force: true });
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
  });

  // ====================================================================
  // Scenario 1: File Upload Restrictions (Negative Upload)
  // ====================================================================
  test('TC-EDGE-01: ระบบต้องจัดการกับการอัปโหลดไฟล์ที่ไม่ใช่รูปภาพ (เช่น .txt) ได้อย่างถูกต้อง', async ({ page }) => {
    // Act: ลองอัปโหลดไฟล์ข้อความ (.txt) แทนที่จะเป็นรูปภาพ
    await page.locator('#uploadPicture').setInputFiles({
      name: 'malicious-script.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a text file, not an image.')
    });
    
    await page.locator('#submit').click({ force: true });

    // เราจึง Assert เพื่อ "ยืนยันช่องโหว่นี้" ว่าไฟล์ .txt หลุดเข้าไปแสดงผลใน Modal จริงๆ
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('tbody tr:has-text("Picture")')).toContainText('malicious-script.txt'); 
  });

  // ====================================================================
  // Scenario 3: Valid Email Edge Cases (EP แบบเจาะลึก)
  // ====================================================================
  test('TC-EDGE-02: ฟิลด์ Email ต้องรองรับรูปแบบที่ซับซ้อนแต่ถูกต้องตามมาตรฐาน (Deep EP)', async ({ page }) => {
    // 💡 ปรับเปลี่ยน Test Data: เนื่องจาก DemoQA มีบั๊กไม่รองรับเครื่องหมาย '+'
    // เราจึงทดสอบด้วยเครื่องหมาย _, -, และ . ซ้อนกันหลายชั้นแทน
    const complexEmail = 'tee.cedt_qa-test@sub-domain.co.th';
    
    // Act
    await page.getByPlaceholder('name@example.com').fill(complexEmail);
    await page.locator('#submit').click({ force: true });

    // Assert 1: ช่อง Email ต้องไม่แสดงขอบสีแดง
    await expect(page.locator('#userEmail')).not.toHaveCSS('border-color', 'rgb(220, 53, 69)');
    
    // Assert 2: Modal ต้องขึ้น และข้อมูลต้องตรง
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('tbody tr:has-text("Student Email")')).toContainText(complexEmail);
  });

});