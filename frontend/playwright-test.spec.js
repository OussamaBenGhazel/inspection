import { test, expect } from '@playwright/test';

test('E2E Full Flow Inspection App', async ({ page }) => {
  // Go to Login
  await page.goto('http://localhost:5173');

  // Fill credentials
  await page.fill('input[placeholder="أدخل اسم المستخدم"]', 'admin');
  await page.fill('input[placeholder="أدخل كلمة المرور"]', 'admin');

  // Submit
  await page.click('button:has-text("تسجيل الدخول")');

  // Verify Dashboard Loaded
  await expect(page.locator('text=آمنة فرحات')).toBeVisible();
  await page.screenshot({ path: 'playwright-dashboard.png' });

  // Navigate to New Inspection
  await page.click('text=تسجيل زيارة ميدانية (S04)');
  await expect(page.locator('text=تسجيل زيارة ميدانية جديدة')).toBeVisible();

  // Click Next to reach step 2
  await page.click('text=التالي');

  // Create an inspection
  await page.fill('textarea[placeholder="ما هي الجوانب المتميزة في أداء الأستاذ خلال هذه الحصة؟"]', 'ملاحظات بيداغوجية ممتازة وتوجيهات عملية.');
  await page.click('text=حفظ كمسودة');

  // Verify dashboard page loaded back
  await expect(page.locator('text=آمنة فرحات')).toBeVisible();
  await page.screenshot({ path: 'playwright-dashboard-success.png' });
});
