import { expect, Page, test } from '@playwright/test';
import ingredients from './mocks/ingredients.json';
import order from './mocks/order.json';
import user from './mocks/user.json';

const bun = ingredients.data.find((item) => item.type === 'bun')!;
const main = ingredients.data.find((item) => item.type === 'main')!;
const sauce = ingredients.data.find((item) => item.type === 'sauce')!;

const mockApi = async (page: Page) => {
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({ json: ingredients });
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({ json: user });
  });

  await page.route('**/api/orders/all', async (route) => {
    await route.fulfill({
      json: { success: true, orders: [], total: 0, totalToday: 0 }
    });
  });

  await page.route('**/api/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ json: order });
      return;
    }

    await route.fulfill({ json: { success: true, orders: [] } });
  });
};

const addIngredient = async (page: Page, ingredientId: string) => {
  await page
    .getByTestId(`ingredient-${ingredientId}`)
    .getByRole('button', { name: 'Добавить' })
    .click();
};

test.beforeEach(async ({ context, page }) => {
  await mockApi(page);
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      domain: '127.0.0.1',
      path: '/'
    }
  ]);
  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
  await page.goto('/');
});

test('adds bun and filling ingredients to constructor', async ({ page }) => {
  await addIngredient(page, bun._id);
  await addIngredient(page, main._id);

  const constructor = page.getByTestId('constructor');
  await expect(constructor.getByText(`${bun.name} (верх)`)).toBeVisible();
  await expect(constructor.getByText(`${bun.name} (низ)`)).toBeVisible();
  await expect(constructor.getByText(main.name)).toBeVisible();
});

test('opens ingredient modal and closes it by close button', async ({ page }) => {
  await page.getByTestId(`ingredient-${sauce._id}`).getByText(sauce.name).click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();
  await expect(page.getByTestId('modal').getByText(sauce.name)).toBeVisible();

  await page.getByTestId('modal-close').click();

  await expect(page.getByTestId('modal')).toBeHidden();
});

test('closes ingredient modal by overlay click', async ({ page }) => {
  await page.getByTestId(`ingredient-${main._id}`).getByText(main.name).click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

  await expect(page.getByTestId('modal')).toBeHidden();
});

test('creates order, shows correct order number and clears constructor', async ({ page }) => {
  await addIngredient(page, bun._id);
  await addIngredient(page, main._id);

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByText(String(order.order.number))).toBeVisible();

  await page.getByTestId('modal-close').click();

  await expect(page.getByTestId('modal')).toBeHidden();
  await expect(
    page.getByTestId('constructor').getByText('Выберите начинку')
  ).toBeVisible();
  await expect(
    page.getByTestId('constructor').getByText('Выберите булки')
  ).toHaveCount(2);
});
