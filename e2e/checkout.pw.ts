import { test, expect, type Page } from '@playwright/test';

async function fillCheckoutForm(page: Page) {
  await page.locator('#email').fill('test@example.com');
  await page.locator('#country').selectOption('NZ');
  await page.locator('#firstName').fill('Jane');
  await page.locator('#lastName').fill('Doe');
  await page.locator('#address').fill('123 Eco Way');
  await page.locator('#apartment').fill('Suite 100');
  await page.locator('#city').fill('Auckland');
  await page.locator('#state').fill('Auckland');
  await page.locator('#zip').fill('1010');
  await page.locator('input[name="shipping"]').check();
  await page.locator('#cardNumber').fill('4242 4242 4242 4242');
  await page.locator('#cardName').fill('Jane Doe');
  await page.locator('#cardExpiry').fill('12/27');
  await page.locator('#cardCvv').fill('123');
}

test.describe('Checkout flow', () => {
  test('should allow a user to fill out the form and place an order', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Contact Information' })).toBeVisible();

    await fillCheckoutForm(page);

    const payBtn = page.getByRole('button', { name: 'Pay now' });
    await expect(payBtn).not.toBeDisabled();
    await payBtn.click();

    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page.getByRole('heading', { name: 'Order Confirmed.' })).toBeVisible();
    await expect(page.getByText(/#NI-\d+-ECO/)).toBeVisible();
  });

  test('shows empty cart state when cart has been checked out', async ({ page, request }) => {
    await request.post('/api/cart/random');
    await request.post('/api/checkout');

    await page.goto('/');

    await expect(page.getByText('Your cart is empty.')).toBeVisible();
  });

  test('shows validation errors when submitting empty form', async ({ page, request }) => {
    await request.post('/api/cart/random');

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Contact Information' })).toBeVisible();

    await page.getByRole('button', { name: 'Pay now' }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Address is required')).toBeVisible();
    await expect(page.getByText('City is required')).toBeVisible();
    await expect(page.getByText('Postcode is required')).toBeVisible();
    await expect(page.getByText('Card number is required')).toBeVisible();
    await expect(page.getByText('Cardholder name is required')).toBeVisible();
    await expect(page.getByText('Expiry date is required')).toBeVisible();
    await expect(page.getByText('CVV is required')).toBeVisible();
  });

  test('handles duplicate submission gracefully with 409 error', async ({ page, request }) => {
    await request.post('/api/cart/random');

    await page.goto('/');
    await fillCheckoutForm(page);
    await page.getByRole('button', { name: 'Pay now' }).click();
    await page.waitForURL(/\/confirmation/);

    await page.goto('/');
    await fillCheckoutForm(page);
    await page.getByRole('button', { name: 'Pay now' }).click();

    await expect(page.getByText('This order has already been placed')).toBeVisible();
  });

  test('layout does not overflow on mobile viewport (375px)', async ({ page, request }) => {
    await request.post('/api/cart/random');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Contact Information' })).toBeVisible();

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);

    await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
  });
});
