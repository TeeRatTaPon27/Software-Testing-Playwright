import { test, expect } from '@playwright/test';

test.describe('การทดสอบ UI แบบไดนามิกและตรรกะที่ซับซ้อน (Dynamic Elements & Logic)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
  });

  test('TC-DYN-01: City Dropdown ต้องไม่มีตัวเลือกหากยังไม่ได้เลือก State และจะเปลี่ยนไปตาม State ที่เลือก', async ({ page }) => {
    // 1.1 Assert ก่อนเลือก State: พยายามกดช่อง City ต้องไม่มีเมนูเด้งขึ้นมา
    await page.locator('#city').click({ force: true });
    await expect(page.getByText('Delhi', { exact: true })).not.toBeVisible();

    // 1.2 Act: เลือก State เป็น "NCR"
    await page.locator('#state').click({ force: true });
    await page.getByText('NCR', { exact: true }).click();

    // 1.3 Assert หลังเลือก State 1: ช่อง City ต้องมีเมืองของ NCR ให้เลือก
    await page.locator('#city').click({ force: true });
    await expect(page.getByText('Delhi', { exact: true })).toBeVisible();

    // 1.4 Act: เปลี่ยน State เป็น "Haryana" (พอกดปุ่มนี้ Dropdown City จะปิดไปเอง)
    await page.locator('#state').click({ force: true });
    await page.getByText('Haryana', { exact: true }).click();

    // 1.5 Assert หลังเปลี่ยน State: เปิด Dropdown City อีกครั้งเพื่อเช็ค "ตัวเลือกใหม่"
    await page.locator('#city').click({ force: true });
    
    // เมืองของ Haryana ต้องโผล่มา
    await expect(page.getByText('Karnal', { exact: true })).toBeVisible(); 
    
    // คราวนี้ตัวเลือก Delhi จะต้องหายไปจริงๆ เพราะไม่ได้ถูกฝังไว้ในกล่องแล้ว
    await expect(page.getByText('Delhi', { exact: true })).not.toBeVisible(); 
  });

  // ====================================================================
  // 2. ตรวจสอบกล่องกรอกวิชา (Requirement 4)
  // ====================================================================
  test('TC-DYN-02: ฟิลด์ Subjects อนุญาตให้เลือกหลายวิชา แสดงเป็น Tags และลบออกได้', async ({ page }) => {
    const subjectsInput = page.locator('#subjectsInput');

    // 2.1 Act: พิมพ์และเลือก 2 วิชา
    await subjectsInput.fill('Maths');
    await page.locator('.subjects-auto-complete__menu').getByText('Maths').click();
    
    await subjectsInput.fill('Physics');
    await page.locator('.subjects-auto-complete__menu').getByText('Physics').click();

    // 2.2 Assert: ตรวจสอบว่ามี Tag แสดงขึ้นมา 2 อัน
    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Maths' })).toBeVisible();
    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Physics' })).toBeVisible();

    // 2.3 Act: กดปุ่ม 'x' (Remove icon) ที่วิชา Maths
    // ในโครงสร้าง React-Select ปุ่มลบจะอยู่ติดกับ Label
    const mathsTagRemoveBtn = page.locator('.subjects-auto-complete__multi-value').filter({ hasText: 'Maths' }).locator('svg');
    await mathsTagRemoveBtn.click();

    // 2.4 Assert: Tag Maths ต้องหายไป แต่ Physics ต้องยังอยู่
    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Maths' })).not.toBeVisible();
    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Physics' })).toBeVisible();
  });

  // ====================================================================
  // 3. ตรวจสอบปฏิทินวันเกิด (Requirement 6.3)
  // ====================================================================
  test('TC-DYN-03: Date of Birth มีค่าเริ่มต้นเป็นวันปัจจุบัน และสามารถเลือกผ่าน Calendar Widget ได้', async ({ page }) => {
    const dobInput = page.locator('#dateOfBirthInput');

    // 3.1 ตรวจสอบค่า Default (ต้องเป็นวันที่ของระบบปัจจุบัน รูปแบบ DD MMM YYYY)
    const today = new Date();
    // ใช้ Intl.DateTimeFormat เพื่อแปลงวันที่ให้ตรงกับฟอร์แมต DemoQA (เช่น "04 Mar 2026")
    const formattedToday = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(today);
    
    await expect(dobInput).toHaveValue(formattedToday);

    // 3.2 Act: กดเปิดปฏิทิน และเปลี่ยนไปเลือก วันที่ 1 มกราคม 2000
    await dobInput.click();
    await page.locator('.react-datepicker__month-select').selectOption({ label: 'January' });
    await page.locator('.react-datepicker__year-select').selectOption({ label: '2000' });
    // เลือกวันที่ 1 (ใช้ aria-label ช่วยเจาะจงวันที่ให้แม่นยำ)
    await page.locator('.react-datepicker__day--001').first().click({ force: true });

    // 3.3 Assert: ช่อง Input ต้องอัปเดตค่าเป็นวันที่เราเลือก
    await expect(dobInput).toHaveValue('01 Jan 2000');
  });

});