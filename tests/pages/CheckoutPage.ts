import { expect, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  async abrir() {
    await this.page.getByTestId('btn-finalizar').click();
    await expect(this.page.getByTestId('modal-checkout')).toBeVisible();
  }

  async preencherValido() {
    await this.page.getByTestId('checkout-nome').fill('Ana');
    await this.page.getByTestId('checkout-email').fill('ana@teste.com');
    await this.page.getByTestId('checkout-cep').fill('12345678');
    await this.page.getByTestId('pagamento-pix').check();
    await this.page.getByTestId('checkout-termos').check();
  }

  async confirmar() { await this.page.getByTestId('btn-confirmar').click(); }
}
