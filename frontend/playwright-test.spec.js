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
  await expect(page.locator('h1:has-text("مرحباً بك في لوحة التحكم العامة")')).toBeVisible();
  await page.screenshot({ path: 'playwright-dashboard.png' });

  // Navigate to New Inspection
  await page.click('button:has-text("تفقد جديد (سريع)")');
  await expect(page.locator('h1:has-text("إنشاء عملية تفقد جديدة")')).toBeVisible();

  // Create an inspection
  await page.selectOption('select', { index: 1 }); // choose first teacher
  await page.fill('textarea[placeholder="اكتب التوصيات البيداغوجية والتعليمية العامة للأستاذ..."]', 'ملاحظات بيداغوجية ممتازة وتوجيهات عملية.');
  await page.click('button:has-text("حفظ عملية التفقد")');

  // Verify details page loaded
  await expect(page.locator('h1:has-text("تفاصيل ومتابعة التفتيش")')).toBeVisible();
  await page.screenshot({ path: 'playwright-details.png' });
});
