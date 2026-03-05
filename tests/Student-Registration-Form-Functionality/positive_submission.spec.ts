import { test, expect } from '@playwright/test';

test.describe('การส่งข้อมูลสำเร็จ (Positive Submission - Happy Path)', () => {

  test.beforeEach(async ({ page }) => {
    // โหลดแค่ DOM และฉีด CSS ลบโฆษณา/Footer ทิ้ง
    await page.goto(process.env.BASE_URL as string, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: '#fixedban, footer { display: none !important; }' });
  });

  test('TC-POS-01: สามารถส่งฟอร์มและแสดง Modal สรุปข้อมูลได้เมื่อกรอกข้อมูลถูกต้องครบถ้วน', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Tee');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByPlaceholder('name@example.com').fill('tee@student.chula.ac.th');
    await page.getByText('Male', { exact: true }).click({ force: true });
    await page.getByPlaceholder('Mobile Number').fill('0812345678');

    await page.locator('#dateOfBirthInput').scrollIntoViewIfNeeded();
    await page.locator('#dateOfBirthInput').click({ force: true });
    await page.locator('.react-datepicker__month-select').selectOption('0'); 
    await page.locator('.react-datepicker__year-select').selectOption('2000');
    await page.locator('.react-datepicker__day--001').first().click({ force: true });

    // กด Enter
    const subjectsInput = page.locator('#subjectsInput');
    await subjectsInput.click({ force: true });
    await subjectsInput.pressSequentially('Maths', { delay: 100 });
    await subjectsInput.press('Enter');
    
    await subjectsInput.click({ force: true });
    await subjectsInput.pressSequentially('Physics', { delay: 100 });
    await subjectsInput.press('Enter');

    await page.getByText('Sports', { exact: true }).click({ force: true });
    await page.getByText('Reading', { exact: true }).click({ force: true });

    await page.locator('#uploadPicture').setInputFiles({
      name: 'profile.png',
      mimeType: 'image/png',
      buffer: Buffer.from('dummy image content')
    });

    await page.getByPlaceholder('Current Address').fill('Bangkok, Thailand');

    await page.locator('#state').click({ force: true });
    await page.getByText('NCR', { exact: true }).click({ force: true });
    
    await page.locator('#city').click({ force: true });
    await page.getByText('Delhi', { exact: true }).click({ force: true });

    await page.locator('#submit').click({ force: true });
    
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toHaveText('Thanks for submitting the form');

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
  });
});