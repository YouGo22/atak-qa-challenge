import { test, expect } from '@playwright/test';
import { PedidoPage } from '../pages/PedidoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';

test.beforeEach(async ({ page }) => {
  const pedido = new PedidoPage(page);
  await pedido.abrir();
  await pedido.adicionar('Mouse sem fio');
});

test('RN09 - QA10 desconta 10%, recalcula ao incrementar e ao remover cupom', async ({ page }) => {
  const pedido = new PedidoPage(page);
  await page.getByTestId('cupom-input').fill('QA10');
  await page.getByTestId('btn-aplicar-cupom').click();
  await expect(page.getByTestId('cupom-aplicado')).toContainText('QA10');
  await expect(page.getByTestId('cupom-aplicado')).toBeVisible();
  await expect(page.getByTestId('cupom-input')).toBeHidden();
  await expect(page.getByTestId('cupom-erro')).toBeHidden();
  await expect(page.getByTestId('valor-desconto')).toHaveText('− R$ 8,00');
  await pedido.conferirTotais('R$ 80,00', 'R$ 25,00', 'R$ 97,00');
  await pedido.aumentar('Mouse sem fio');
  await expect(page.getByTestId('valor-desconto')).toHaveText('− R$ 16,00');
  await pedido.conferirTotais('R$ 160,00', 'R$ 25,00', 'R$ 169,00');
  await page.getByTestId('btn-remover-cupom').click();
  await expect(page.getByTestId('cupom-aplicado')).toBeHidden();
  await expect(page.getByTestId('cupom-input')).toBeVisible();
  await expect(page.getByTestId('valor-desconto')).toHaveText('R$ 0,00');
  await pedido.conferirTotais('R$ 160,00', 'R$ 25,00', 'R$ 185,00');
});

test('RN09 - rejeita cupom inválido sem alterar totais', async ({ page }) => {
  await page.getByTestId('cupom-input').fill('INVALIDO');
  await page.getByTestId('btn-aplicar-cupom').click();
  await expect(page.getByTestId('cupom-erro')).toBeVisible();
  await expect(page.getByTestId('cupom-erro')).toHaveText('Cupom inválido ou expirado.');
  await expect(page.getByTestId('cupom-aplicado')).toBeHidden();
  await expect(page.getByTestId('valor-desconto')).toHaveText('R$ 0,00');
  await new PedidoPage(page).conferirTotais('R$ 80,00', 'R$ 25,00', 'R$ 105,00');
});

test('RN08 - frete considera subtotal antes do desconto QA10', async ({ page }) => {
  const pedido = new PedidoPage(page);
  await pedido.remover('Mouse sem fio');
  await pedido.adicionar('Webcam Full HD');
  await pedido.conferirTotais('R$ 219,00', 'Grátis', 'R$ 219,00');
  await page.getByTestId('cupom-input').fill('QA10');
  await page.getByTestId('btn-aplicar-cupom').click();
  await expect(page.getByTestId('valor-desconto')).toHaveText('− R$ 21,90');
  // Após o desconto, R$ 197,10 fica abaixo do limite; o frete continua grátis.
  await pedido.conferirTotais('R$ 219,00', 'Grátis', 'R$ 197,10');
});

test('RN09 - interface permite somente um cupom por pedido', async ({ page }) => {
  const pedido = new PedidoPage(page);
  await page.getByTestId('cupom-input').fill('QA10');
  await page.getByTestId('btn-aplicar-cupom').click();
  await expect(page.getByTestId('cupom-aplicado')).toHaveCount(1);
  await expect(page.getByTestId('cupom-aplicado')).toBeVisible();
  await expect(page.getByTestId('cupom-aplicado')).toContainText('QA10');
  // A interface oculta tanto a entrada quanto a ação de aplicar outro cupom.
  await expect(page.getByTestId('cupom-input')).toBeHidden();
  await expect(page.getByTestId('btn-aplicar-cupom')).toBeHidden();
  await expect(page.getByTestId('valor-desconto')).toHaveText('− R$ 8,00');
  await pedido.conferirTotais('R$ 80,00', 'R$ 25,00', 'R$ 97,00');

  // Uma nova aplicação pela interface exige remover o cupom atual primeiro.
  await page.getByTestId('btn-remover-cupom').click();
  await expect(page.getByTestId('cupom-aplicado')).toBeHidden();
  await expect(page.getByTestId('cupom-input')).toBeVisible();
  await expect(page.getByTestId('btn-aplicar-cupom')).toBeVisible();
  await expect(page.getByTestId('valor-desconto')).toHaveText('R$ 0,00');
  await pedido.conferirTotais('R$ 80,00', 'R$ 25,00', 'R$ 105,00');
  await page.getByTestId('cupom-input').fill('QA10');
  await page.getByTestId('btn-aplicar-cupom').click();
  await expect(page.getByTestId('cupom-aplicado')).toHaveCount(1);
  await expect(page.getByTestId('cupom-aplicado')).toBeVisible();
  await expect(page.getByTestId('cupom-aplicado')).toContainText('QA10');
  await expect(page.getByTestId('btn-aplicar-cupom')).toBeHidden();
  await expect(page.getByTestId('valor-desconto')).toHaveText('− R$ 8,00');
  await pedido.conferirTotais('R$ 80,00', 'R$ 25,00', 'R$ 97,00');
});

const campos = ['nome', 'email', 'cep', 'pagamento', 'termos'];
for (const caso of [
  { nome: 'nome obrigatório', campo: 'nome', valor: '', mensagem: 'Informe o nome completo (mínimo de 3 caracteres).' },
  { nome: 'nome com dois caracteres', campo: 'nome', valor: 'Al', mensagem: 'Informe o nome completo (mínimo de 3 caracteres).' },
  { nome: 'e-mail obrigatório', campo: 'email', valor: '', mensagem: 'Informe um e-mail válido.' },
  { nome: 'e-mail inválido', campo: 'email', valor: 'ana@teste', mensagem: 'Informe um e-mail válido.' },
  { nome: 'CEP obrigatório', campo: 'cep', valor: '', mensagem: 'Informe um CEP válido com 8 dígitos.' },
  { nome: 'CEP com seis dígitos', campo: 'cep', valor: '123456', mensagem: 'Informe um CEP válido com 8 dígitos.' },
  { nome: 'CEP com sete dígitos', campo: 'cep', valor: '1234567', mensagem: 'Informe um CEP válido com 8 dígitos.' },
  { nome: 'pagamento obrigatório', campo: 'pagamento', valor: '', mensagem: 'Escolha uma forma de pagamento.' },
  { nome: 'aceite dos termos obrigatório', campo: 'termos', valor: '', mensagem: 'É preciso aceitar os termos de venda.' },
]) {
  test(`RN10 - valida individualmente ${caso.nome}`, async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.abrir();
    await checkout.preencherValido();
    if (caso.campo === 'pagamento') {
      // Reabrir limpa a seleção de rádio sem alterar o DOM da aplicação.
      await page.getByTestId('btn-cancelar').click();
      await checkout.abrir();
      await page.getByTestId('checkout-nome').fill('Ana');
      await page.getByTestId('checkout-email').fill('ana@teste.com');
      await page.getByTestId('checkout-cep').fill('12345678');
      await page.getByTestId('checkout-termos').check();
    } else if (caso.campo === 'termos') {
      await page.getByTestId('checkout-termos').uncheck();
    } else {
      await page.getByTestId(`checkout-${caso.campo}`).fill(caso.valor);
    }
    await checkout.confirmar();
    await expect(page.getByTestId(`erro-${caso.campo}`)).toBeVisible();
    await expect(page.getByTestId(`erro-${caso.campo}`)).toHaveText(caso.mensagem);
    for (const campo of campos.filter(campo => campo !== caso.campo)) {
      await expect(page.getByTestId(`erro-${campo}`)).toBeHidden();
    }
    await expect(page.getByTestId('form-checkout')).toBeVisible();
    await expect(page.getByTestId('pedido-sucesso')).toBeHidden();
    await expect(new PedidoPage(page).contador).toHaveText('1');
  });
}

for (const pagamento of ['pix', 'boleto', 'cartao']) {
  test(`RN11 - confirma pedido válido com ${pagamento} e esvazia carrinho`, async ({ page }) => {
    const checkout = new CheckoutPage(page);
    const pedido = new PedidoPage(page);
    await checkout.abrir();
    await checkout.preencherValido();
    await page.getByTestId(`pagamento-${pagamento}`).check();
    await checkout.confirmar();
    await expect(page.getByTestId('pedido-sucesso')).toBeVisible();
    await expect(page.getByTestId('pedido-numero')).toHaveText(/^PED-\d{6}$/);
    await expect(page.getByTestId('form-checkout')).toBeHidden();
    await page.getByTestId('btn-novo-pedido').click();
    await expect(page.getByTestId('modal-checkout')).toBeHidden();
    await expect(pedido.itens).toHaveCount(0);
    await expect(pedido.contador).toHaveText('0');
    await expect(page.getByTestId('pedido-vazio')).toBeVisible();
    await expect(page.getByTestId('btn-finalizar')).toBeDisabled();
    await pedido.conferirTotais('R$ 0,00', 'R$ 0,00', 'R$ 0,00');
    await expect(page.getByTestId('valor-desconto')).toHaveText('R$ 0,00');
  });
}

test('RN12 - logout descarta pedido e cupom após novo login', async ({ page }) => {
  const pedido = new PedidoPage(page);
  const login = new LoginPage(page);
  await pedido.aumentar('Mouse sem fio');
  await page.getByTestId('cupom-input').fill('QA10');
  await page.getByTestId('btn-aplicar-cupom').click();
  await expect(pedido.contador).toHaveText('2');
  await expect(page.getByTestId('valor-desconto')).toHaveText('− R$ 16,00');
  await page.getByTestId('btn-sair').click();
  await expect(login.tela).toBeVisible();
  await expect(login.aplicacao).toBeHidden();
  await expect(login.email).toBeEmpty();
  await expect(login.senha).toBeEmpty();
  // Sem navegação ou reload: a própria ação Sair deve descartar o estado.
  await login.autenticar('candidato@teste.com', 'Senha@123');
  await expect(login.aplicacao).toBeVisible();
  await expect(pedido.produtos).toHaveCount(8);
  await expect(pedido.itens).toHaveCount(0);
  await expect(pedido.contador).toHaveText('0');
  await expect(page.getByTestId('pedido-vazio')).toBeVisible();
  await expect(page.getByTestId('cupom-aplicado')).toBeHidden();
  await expect(page.getByTestId('valor-desconto')).toHaveText('R$ 0,00');
  await expect(page.getByTestId('btn-finalizar')).toBeDisabled();
  await pedido.conferirTotais('R$ 0,00', 'R$ 0,00', 'R$ 0,00');
});
