import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const usuario = { email: 'candidato@teste.com', senha: 'Senha@123' };

test('RN01 - permite login com credenciais válidas', async ({ page }) => {
  const login = new LoginPage(page);
  await login.abrir();
  await login.autenticar(usuario.email, usuario.senha);
  await expect(login.aplicacao).toBeVisible();
  await expect(login.tela).toBeHidden();
  await expect(login.usuario).toHaveText('Candidato QA');
  await expect(login.erro).toBeHidden();
});

for (const caso of [
  { nome: 'ambos os campos vazios', email: '', senha: '' },
  { nome: 'e-mail vazio', email: '', senha: usuario.senha },
  { nome: 'senha vazia', email: usuario.email, senha: '' },
  { nome: 'e-mail contendo somente espaços', email: '   ', senha: usuario.senha },
]) {
  test(`RN02 - rejeita ${caso.nome}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.abrir();
    await login.autenticar(caso.email, caso.senha);
    await expect(login.erro).toHaveText('Informe e-mail e senha.');
    await expect(login.erro).toBeVisible();
    await expect(login.tela).toBeVisible();
    await expect(login.aplicacao).toBeHidden();
  });
}

for (const email of ['candidatoteste.com', 'candidato@', 'candidato@teste', 'candidato teste@teste.com']) {
  test(`RN02 - rejeita e-mail malformado: ${email}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.abrir();
    await login.autenticar(email, usuario.senha);
    await expect(login.erro).toHaveText('Informe um e-mail válido.');
    await expect(login.erro).toBeVisible();
    await expect(login.tela).toBeVisible();
    await expect(login.aplicacao).toBeHidden();
  });
}

test('RN03 - bloqueia na terceira falha e libera após recarregar', async ({ page }) => {
  const login = new LoginPage(page);
  await login.abrir();
  for (const restantes of [2, 1]) {
    await login.autenticar(usuario.email, 'SenhaIncorreta');
    await expect(login.erro).toHaveText(`E-mail ou senha incorretos. Tentativas restantes: ${restantes}.`);
    await expect(login.entrar).toBeEnabled();
    await expect(login.aplicacao).toBeHidden();
  }
  await login.autenticar(usuario.email, 'SenhaIncorreta');
  await expect(login.erro).toHaveText('Acesso bloqueado após 3 tentativas inválidas. Recarregue a página para tentar novamente.');
  await expect(login.entrar).toBeDisabled();
  await expect(login.tela).toBeVisible();

  // Credenciais corretas também não devem permitir acesso durante o bloqueio.
  await login.senha.fill(usuario.senha);
  await login.senha.press('Enter');
  await expect(login.entrar).toBeDisabled();
  await expect(login.aplicacao).toBeHidden();

  await page.reload();
  await expect(login.entrar).toBeEnabled();
  await login.autenticar(usuario.email, usuario.senha);
  await expect(login.aplicacao).toBeVisible();
});

test('RN03 - login válido reinicia a sequência de tentativas inválidas', async ({ page }) => {
  const login = new LoginPage(page);
  await login.abrir();
  for (const restantes of [2, 1]) {
    await login.autenticar(usuario.email, 'SenhaIncorreta');
    await expect(login.erro).toContainText(`Tentativas restantes: ${restantes}.`);
  }
  await login.autenticar(usuario.email, usuario.senha);
  await expect(login.aplicacao).toBeVisible();
  // Sair permite testar uma nova sequência na mesma página, sem recarregar o estado.
  await page.getByTestId('btn-sair').click();
  await expect(login.tela).toBeVisible();
  await login.autenticar(usuario.email, 'SenhaIncorreta');
  await expect(login.erro).toHaveText('E-mail ou senha incorretos. Tentativas restantes: 2.');
  await expect(login.entrar).toBeEnabled();
});

for (const caso of [
  { nome: 'senha válida de teste', senha: usuario.senha },
  { nome: 'senha incorreta', senha: 'OutraSenha' },
  { nome: 'senha vazia', senha: '' },
]) {
  test(`RN04 - informa usuário bloqueado com ${caso.nome}`, async ({ page }) => {
    const login = new LoginPage(page);
    await login.abrir();
    await login.autenticar('bloqueado@teste.com', caso.senha);
    await expect(login.erro).toContainText('Usuário bloqueado');
    await expect(login.erro).toBeVisible();
    await expect(login.tela).toBeVisible();
    await expect(login.aplicacao).toBeHidden();
  });
}
