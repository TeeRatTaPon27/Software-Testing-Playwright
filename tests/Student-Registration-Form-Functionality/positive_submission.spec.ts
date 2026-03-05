import { test, expect } from '@playwright/test';

test.describe('การส่งข้อมูลสำเร็จ (Positive Submission - Happy Path)', () => {

  test.describe('การส่งข้อมูลสำเร็จ (Positive Submission - Happy Path)', () => {

  test.beforeEach(async ({ page }) => {
    // โหลดหน้าเว็บ
    await page.goto(process.env.BASE_URL as string);
  });

  test('TC-POS-01: สามารถส่งฟอร์มและแสดง Modal สรุปข้อมูลได้เมื่อกรอกข้อมูลถูกต้องครบถ้วน', async ({ page }) => {
    // ==========================================
    // 1. Arrange & Act: กรอกข้อมูลฟิลด์ต่างๆ
    // ==========================================
    
    // ข้อมูลส่วนตัวพื้นฐาน
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByPlaceholder('name@example.com').fill('tee@student.chula.ac.th');
    
    // เลือกเพศ
    await page.getByText('Male', { exact: true }).click({ force: true });

    // เบอร์โทรศัพท์ 10 หลัก
    await page.getByPlaceholder('Mobile Number').fill('0812345678');

    // วันเกิด (Date of Birth) - เลือก 1 Jan 2000
    await page.locator('#dateOfBirthInput').click();
    await page.locator('.react-datepicker__month-select').selectOption('0'); 
    await page.locator('.react-datepicker__year-select').selectOption('2000');
    await page.locator('.react-datepicker__day--001').first().click({ force: true });

    // วิชาที่สนใจ (Subjects)
    const subjectsInput = page.locator('#subjectsInput');
    
    await subjectsInput.click();
    await subjectsInput.pressSequentially('Maths', { delay: 100 }); // พิมพ์ทีละตัว หน่วง 100ms
    await page.locator('.subjects-auto-complete__menu').getByText('Maths').click({ force: true });
    
    await subjectsInput.click();
    await subjectsInput.pressSequentially('Physics', { delay: 100 });
    await page.locator('.subjects-auto-complete__menu').getByText('Physics').click({ force: true });

    // งานอดิเรก (Hobbies)
    await page.getByText('Sports', { exact: true }).click({ force: true });
    await page.getByText('Reading', { exact: true }).click({ force: true });

    // อัปโหลดรูปภาพ
    await page.locator('#uploadPicture').setInputFiles({
      name: 'profile.png',
      mimeType: 'image/png',
      buffer: Buffer.from('dummy image content')
    });

    // ที่อยู่ปัจจุบัน
    await page.getByPlaceholder('Current Address').fill('Bangkok, Thailand');

    // State และ City
    await page.locator('#state').click({ force: true });
    await page.getByText('NCR', { exact: true }).click({ force: true });
    
    await page.locator('#city').click({ force: true });
    await page.getByText('Delhi', { exact: true }).click({ force: true });

    // กดปุ่ม Submit 
    await page.locator('#submit').click({ force: true });

    // ==========================================
    // 2. Assert: ตรวจสอบความถูกต้องของ Modal สรุปผล
    // ==========================================
    
    const modal = page.locator('.modal-content');
    
    // 2.1 ตรวจสอบว่า Modal เด้งขึ้นมา และมีหัวข้อที่ถูกต้อง
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toHaveText('Thanks for submitting the form');

    // 2.2 ตรวจสอบข้อมูลในตารางว่าตรงกับที่กรอกไปหรือไม่
    await expect(page.locator('tbody tr:has-text("Student Name")')).toContainText('Tee Tester');
    await expect(page.locator('tbody tr:has-text("Student Email")')).toContainText('tee@student.chula.ac.th');
    await expect(page.locator('tbody tr:has-text("Gender")')).toContainText('Male');
    await expect(page.locator('tbody tr:has-text("Mobile")')).toContainText('0812345678');
    await expect(page.locator('tbody tr:has-text("Date of Birth")')).toContainText('01 January,2000');
    await expect(page.locator('tbody tr:has-text("Subjects")')).toContainText('Maths, Physics');
    await expect(page.locator('tbody tr:has-text("Hobbies")')).toContainText('Sports, Reading');
    await expect(page.locator('tbody tr:has-text("Picture")')).toContainText('profile.png');
    await expect(page.locator('tbody tr:has-text("Address")')).toContainText('Bangkok, Thailand');
    await expect(page.locator('tbody tr:has-text("State and City")')).toContainText('NCR Delhi');

    // ลบขั้นตอนกดปิดปุ่ม Close ออก จบเทสแค่การตรวจสอบตารางข้อมูล
  });
});
});