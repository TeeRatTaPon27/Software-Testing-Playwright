import { test, expect } from '@playwright/test';

test.describe('การตรวจสอบความถูกต้องของฟิลด์ (Field Validation - BVA & EP)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    
    // Must do
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByText('Male', { exact: true }).click();
  });

  // ====================================================================
  // 1. Technique: Boundary Value Analysis (BVA) สำหรับช่อง Mobile (10 หลัก)
  // ขอบเขต (Boundary): Lower = 9, On Point = 10, Upper = 11
  // ====================================================================

  test('TC-BVA-01: Lower Bound (9 หลัก) - ต้องติด Invalid Validation', async ({ page }) => {
    // Act: กรอกเบอร์แค่ 9 หลัก
    const mobileInput = page.getByPlaceholder('Mobile Number');
    await mobileInput.fill('081234567');
    
    // บังคับคลิกที่อื่น 1 ที เพื่อให้เคอร์เซอร์หลุดจากช่อง (Trigger Blur Event ให้ Firefox)
    await page.locator('body').click({ force: true }); 
    
    await page.locator('#submit').click({ force: true });

    // Assert 1: เช็คสถานะ Invalid ทาง HTML5 (แม่นยำกว่าเช็คสี)
    const isValid = await mobileInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);

    // Assert 2: Modal ต้องไม่ปรากฏ
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('TC-BVA-02: On Point (10 หลัก) - ต้องผ่านและส่งฟอร์มสำเร็จ', async ({ page }) => {
    // Act: กรอกเบอร์ 10 หลักพอดีเป๊ะ
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    await page.locator('#submit').click({ force: true });

    // Assert: ต้องผ่านการตรวจสอบ และ Modal สรุปผลต้องเด้งขึ้นมา
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('TC-BVA-03: Upper Bound (11 หลัก) - ระบบต้องตัดทิ้งเหลือแค่ 10 หลัก (Max Length)', async ({ page }) => {
    // Act: พยายามกรอกเบอร์ 11 หลัก
    const mobileInput = page.getByPlaceholder('Mobile Number');
    await mobileInput.fill('08123456789'); // เลข 9 คือตัวที่เกินมา

    // Assert: DemoQA จะตั้งค่า maxlength ไว้ ทำให้พิมพ์ตัวที่ 11 ไม่ติด
    // เราเลยเช็คว่า Value ที่อยู่ในช่อง มีแค่ 10 หลักจริงๆ
    await expect(mobileInput).toHaveValue('0812345678');
  });

  test('TC-BVA-04: Invalid Characters - ระบบต้องติด Validation สีแดงเมื่อกรอกตัวอักษร', async ({ page }) => {
    // Act: พยายามกรอกตัวอักษรภาษาอังกฤษ แล้วกด Submit
    const mobileInput = page.getByPlaceholder('Mobile Number');
    await mobileInput.fill('abcdefghij');
    await page.locator('#submit').click({ force: true });

    // Assert: ตัวเว็บยอมให้พิมพ์ แต่เมื่อ Submit ตัว pattern="\d*" จะทำงาน
    // ทำให้ช่องเบอร์มือถือกลายเป็นสถานะ Invalid (ขอบสีแดง) และส่งฟอร์มไม่ผ่าน
    await expect(mobileInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });


  // ====================================================================
  // 2. Technique: Equivalence Partitioning (EP) สำหรับช่อง Email
  // แบ่งกลุ่ม (Partitions): Valid (มี @ และ domain), Invalid (ขาด @), Invalid (ขาด domain)
  // ====================================================================

  test('TC-EP-01: Invalid Email (ขาดสัญลักษณ์ @) - ต้องติด Invalid Validation', async ({ page }) => {
    // Arrange: ใส่เบอร์มือถือให้ถูกต้องก่อน
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    
    // Act: พิมพ์อีเมลผิดรูปแบบ (ไม่มี @)
    await page.getByPlaceholder('name@example.com').fill('teestudent.chula.ac.th');
    await page.locator('#submit').click({ force: true });

    // Assert: ช่องอีเมลต้องมีขอบสีแดง
    await expect(page.locator('#userEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

  test('TC-EP-02: Invalid Email (ขาด Domain) - ต้องติด Invalid Validation', async ({ page }) => {
    // Arrange: ใส่เบอร์มือถือให้ถูกต้อง
    await page.getByPlaceholder('Mobile Number').fill('0812345678');
    
    // Act: พิมพ์อีเมลผิดรูปแบบ (มี @ แต่ไม่มีโดเมนต่อท้าย)
    await page.getByPlaceholder('name@example.com').fill('tee@');
    await page.locator('#submit').click({ force: true });

    // Assert: ช่องอีเมลต้องมีขอบสีแดง
    await expect(page.locator('#userEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });

});