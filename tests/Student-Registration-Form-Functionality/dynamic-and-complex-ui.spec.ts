import { test, expect } from '@playwright/test';

test.describe('การทดสอบ UI แบบไดนามิกและตรรกะที่ซับซ้อน (Dynamic Elements & Logic)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string, { waitUntil: 'domcontentloaded' });
  });

  test('TC-DYN-01: City Dropdown ต้องไม่มีตัวเลือกหากยังไม่ได้เลือก State และจะเปลี่ยนไปตาม State ที่เลือก', async ({ page }) => {
    await page.locator('#city').click({ force: true });
    await expect(page.getByText('Delhi', { exact: true })).not.toBeVisible();

    await page.locator('#state').click({ force: true });
    await page.getByText('NCR', { exact: true }).click({ force: true });

    await page.locator('#city').click({ force: true });
    await expect(page.getByText('Delhi', { exact: true })).toBeVisible();

    await page.locator('#state').click({ force: true });
    await page.getByText('Haryana', { exact: true }).click({ force: true });

    await page.locator('#city').click({ force: true });
    await expect(page.getByText('Karnal', { exact: true })).toBeVisible(); 
    await expect(page.getByText('Delhi', { exact: true })).not.toBeVisible(); 
  });

  test('TC-DYN-02: ฟิลด์ Subjects อนุญาตให้เลือกหลายวิชา แสดงเป็น Tags และลบออกได้', async ({ page }) => {
    const subjectsInput = page.locator('#subjectsInput');

    // วิชา Maths
    await subjectsInput.click({ force: true });
    await subjectsInput.pressSequentially('Maths', { delay: 100 });
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');

    // วิชา Physics
    await subjectsInput.click({ force: true });
    await subjectsInput.pressSequentially('Physics', { delay: 100 });
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');

    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Maths' })).toBeVisible();
    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Physics' })).toBeVisible();

    const mathsTagRemoveBtn = page.locator('.subjects-auto-complete__multi-value').filter({ hasText: 'Maths' }).locator('svg');
    await mathsTagRemoveBtn.click({ force: true });

    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Maths' })).not.toBeVisible();
    await expect(page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: 'Physics' })).toBeVisible();
  });

  test('TC-DYN-03: Date of Birth มีค่าเริ่มต้นเป็นวันปัจจุบัน และสามารถเลือกผ่าน Calendar Widget ได้', async ({ page }) => {
    const dobInput = page.locator('#dateOfBirthInput');

    const today = new Date();
    const formattedToday = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(today);
    
    await expect(dobInput).toHaveValue(formattedToday);

    // บังคับเลื่อนจอมาที่ปฏิทินก่อนคลิก
    await dobInput.scrollIntoViewIfNeeded(); 
    await dobInput.click({ force: true });
    
    await page.locator('.react-datepicker__month-select').selectOption({ label: 'January' });
    await page.locator('.react-datepicker__year-select').selectOption({ label: '2000' });
    await page.locator('.react-datepicker__day--001').first().click({ force: true });

    await expect(dobInput).toHaveValue('01 Jan 2000');
  });

});