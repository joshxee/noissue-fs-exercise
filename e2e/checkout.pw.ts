import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test('should allow a user to fill out the form and place an order', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Contact Information' })).toBeVisible();

    // Contact information
    await page.locator('#email').fill('test@example.com');
    await page.locator('#newsletter').check();

    // Delivery — fill address fields to unlock shipping section
    await page.locator('#country').selectOption('NZ');
    await page.locator('#firstName').fill('Jane');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#address').fill('123 Eco Way');
    await page.locator('#apartment').fill('Suite 100');
    await page.locator('#city').fill('Auckland');
    await page.locator('#state').fill('Auckland');
    await page.locator('#zip').fill('1010');

    // Shipping — revealed once address is complete
    await expect(page.getByText('Standard Shipping')).toBeVisible();
    await page.locator('input[name="shipping"]').check();

    // Payment — credit card fields (4242... passes Luhn)
    await page.locator('#cardNumber').fill('4242 4242 4242 4242');
    await page.locator('#cardName').fill('Jane Doe');
    await page.locator('#cardExpiry').fill('12/27');
    await page.locator('#cardCvv').fill('123');

    // Pay now should be enabled once all fields are valid
    const payBtn = page.getByRole('button', { name: 'Pay now' });
    await expect(payBtn).not.toBeDisabled();
    await payBtn.click();

    // Confirm navigation to order confirmation page
    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page.getByRole('heading', { name: 'Order Confirmed.' })).toBeVisible();
    await expect(page.getByText(/#NI-\d+-ECO/)).toBeVisible();
  });
});
