import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  get tela() { return this.page.getByTestId('tela-login'); }
  get email() { return this.page.getByTestId('login-email'); }
  get senha() { return this.page.getByTestId('login-senha'); }
  get entrar() { return this.page.getByTestId('btn-entrar'); }
  get erro() { return this.page.getByTestId('login-erro'); }
  get aplicacao() { return this.page.getByTestId('tela-app'); }
  get usuario() { return this.page.getByTestId('usuario-nome'); }

  async abrir() {
    await this.page.goto('/portal-pedidos-qa.html');
  }

  async autenticar(email: string, senha: string) {
    await this.email.fill(email);
    await this.senha.fill(senha);
    await this.entrar.click();
  }
}
