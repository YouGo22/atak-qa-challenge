import { expect, type Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

export class PedidoPage {
  constructor(readonly page: Page) {}

  get produtos() { return this.page.getByTestId('produto-card'); }
  get nomes() { return this.produtos.getByTestId('produto-nome'); }
  get itens() { return this.page.getByTestId('item-pedido'); }
  get contador() { return this.page.getByTestId('carrinho-contador'); }

  produto(nome: string) {
    return this.produtos.filter({ has: this.page.getByTestId('produto-nome').getByText(nome, { exact: true }) });
  }

  item(nome: string) {
    return this.itens.filter({ has: this.page.getByTestId('item-nome').filter({ hasText: nome }) });
  }

  async abrir() {
    const login = new LoginPage(this.page);
    await login.abrir();
    await login.autenticar('candidato@teste.com', 'Senha@123');
    await expect(login.aplicacao).toBeVisible();
    // Aguarda o resultado observável do carregamento, sem depender de sua duração.
    await expect(this.produtos).toHaveCount(8);
    await expect(this.page.getByTestId('catalogo-carregando')).toBeHidden();
  }

  async adicionar(nome: string) {
    await this.produto(nome).getByTestId('btn-adicionar').click();
  }

  async aumentar(nome: string) { await this.item(nome).getByTestId('btn-aumentar').click(); }
  async diminuir(nome: string) { await this.item(nome).getByTestId('btn-diminuir').click(); }
  async remover(nome: string) { await this.item(nome).getByTestId('btn-remover').click(); }

  async conferirTotais(subtotal: string, frete: string, total: string) {
    await expect(this.page.getByTestId('valor-subtotal')).toHaveText(subtotal);
    await expect(this.page.getByTestId('valor-frete')).toHaveText(frete);
    await expect(this.page.getByTestId('valor-total')).toHaveText(total);
  }
}
