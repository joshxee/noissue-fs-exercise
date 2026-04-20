import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test('should allow a user to fill out the form and place an order', async ({ page }) => {
    // Navigate to the checkout page
    await page.goto('/');

    // Assert we are on the checkout page by checking a heading
    await expect(page.getByRole('heading', { name: 'Contact Information' })).toBeVisible();

    // Fill in Contact Information
    await page.locator('#email').fill('test@example.com');
    
    // Check newsletter
    await page.locator('#newsletter').check();

    // Fill in Delivery Information
    await page.locator('#country').selectOption('US');
    await page.locator('#firstName').fill('Jane');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#address').fill('123 Eco Way');
    await page.locator('#apartment').fill('Suite 100');
    await page.locator('#city').fill('Portland');
    await page.locator('#state').selectOption('CA');
    await page.locator('#zip').fill('90210');

    // Select PayPal payment method (Credit card is default)
    await page.getByLabel('PayPal').check();

    // Click "Pay now" button (submits checkout form to backend)
    await page.getByRole('button', { name: 'Pay now' }).click();

    // Wait for navigation and assert we are on the confirmation page
    await expect(page).toHaveURL(/\/confirmation/);

    // Assert the confirmation text is visible
    await expect(page.getByRole('heading', { name: 'Order Confirmed.' })).toBeVisible();

    // Assert a dynamic order reference is visible
    await expect(page.getByText(/#NI-\d+-ECO/)).toBeVisible();
  });
});
