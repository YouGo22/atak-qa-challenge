import { test, expect } from '@playwright/test';
import { PedidoPage } from '../pages/PedidoPage';

test.beforeEach(async ({ page }) => {
  await new PedidoPage(page).abrir();
});

test('Catálogo - carrega os oito produtos e inicia pedido vazio', async ({ page }) => {
  const pedido = new PedidoPage(page);
  await expect(page.getByTestId('catalogo-total')).toHaveText('8 produtos encontrados');
  await expect(pedido.itens).toHaveCount(0);
  await expect(page.getByTestId('pedido-vazio')).toBeVisible();
  await expect(pedido.contador).toHaveText('0');
  await pedido.conferirTotais('R$ 0,00', 'R$ 0,00', 'R$ 0,00');
});

for (const termo of ['Teclado', 'teclado', 'TECLADO', 'tEcLaDo']) {
  test(`RN05 - busca sem diferenciar caixa: ${termo}`, async ({ page }) => {
    const pedido = new PedidoPage(page);
    await page.getByTestId('filtro-busca').fill(termo);
    await expect(pedido.nomes).toHaveText(['Teclado mecânico']);
    await expect(page.getByTestId('catalogo-total')).toHaveText('1 produto encontrado');
  });
}

test('RN05 - busca sem resultado e limpeza restauram catálogo', async ({ page }) => {
  const pedido = new PedidoPage(page);
  await page.getByTestId('filtro-busca').fill('produto inexistente');
  await expect(pedido.produtos).toHaveCount(0);
  await expect(page.getByTestId('catalogo-vazio')).toBeVisible();
  await page.getByTestId('filtro-busca').clear();
  await expect(pedido.produtos).toHaveCount(8);
  await expect(page.getByTestId('catalogo-vazio')).toBeHidden();
});

for (const caso of [
  { categoria: 'Periféricos', nomes: ['Teclado mecânico', 'Mouse sem fio', 'Webcam Full HD'] },
  { categoria: 'Monitores', nomes: ['Monitor 24"'] },
  { categoria: 'Áudio', nomes: ['Headset USB', 'Caixa de som'] },
  { categoria: 'Acessórios', nomes: ['Hub USB-C', 'Suporte para notebook'] },
]) {
  test(`Catálogo - filtro ${caso.categoria}`, async ({ page }) => {
    const pedido = new PedidoPage(page);
    await page.getByTestId('filtro-categoria').selectOption(caso.categoria);
    await expect(pedido.nomes).toHaveText(caso.nomes);
    await expect(pedido.produtos.getByTestId('produto-categoria')).toHaveText(caso.nomes.map(() => caso.categoria));
    await page.getByTestId('filtro-categoria').selectOption('');
    await expect(pedido.produtos).toHaveCount(8);
  });
}

const ordemCrescente = ['Suporte para notebook', 'Hub USB-C', 'Mouse sem fio', 'Caixa de som', 'Teclado mecânico', 'Headset USB', 'Webcam Full HD', 'Monitor 24"'];
for (const ordem of ['preco-asc', 'preco-desc']) {
  test(`Catálogo - ordenação ${ordem}`, async ({ page }) => {
    await page.getByTestId('filtro-ordenacao').selectOption(ordem);
    await expect(new PedidoPage(page).nomes).toHaveText(ordem === 'preco-asc' ? ordemCrescente : [...ordemCrescente].reverse());
  });
}

test('Catálogo - combina busca, categoria e preço', async ({ page }) => {
  await page.getByTestId('filtro-busca').fill('e');
  await page.getByTestId('filtro-categoria').selectOption('Periféricos');
  await page.getByTestId('filtro-ordenacao').selectOption('preco-asc');
  await expect(new PedidoPage(page).nomes).toHaveText(['Mouse sem fio', 'Teclado mecânico', 'Webcam Full HD']);
});

test('RN06 - produto sem estoque impede adição', async ({ page }) => {
  const pedido = new PedidoPage(page);
  const monitor = pedido.produto('Monitor 24"');
  await expect(monitor.getByTestId('produto-estoque')).toHaveText('Sem estoque');
  await expect(monitor.getByTestId('btn-adicionar')).toBeDisabled();
  // Um clique físico no botão desabilitado não deve alterar o pedido.
  await monitor.getByTestId('btn-adicionar').click({ force: true });
  await expect(pedido.itens).toHaveCount(0);
  await expect(pedido.contador).toHaveText('0');
  await pedido.conferirTotais('R$ 0,00', 'R$ 0,00', 'R$ 0,00');
});

test('RN07 - adiciona, incrementa, decrementa e remove com totais e contador', async ({ page }) => {
  const pedido = new PedidoPage(page);
  await pedido.adicionar('Mouse sem fio');
  await expect(pedido.item('Mouse sem fio').getByTestId('item-quantidade')).toHaveText('1');
  await expect(pedido.contador).toHaveText('1');
  await pedido.conferirTotais('R$ 80,00', 'R$ 25,00', 'R$ 105,00');
  await pedido.aumentar('Mouse sem fio');
  await expect(pedido.item('Mouse sem fio').getByTestId('item-quantidade')).toHaveText('2');
  await expect(pedido.item('Mouse sem fio').getByTestId('item-total')).toHaveText('R$ 160,00');
  await expect(pedido.contador).toHaveText('2');
  await pedido.conferirTotais('R$ 160,00', 'R$ 25,00', 'R$ 185,00');
  await pedido.adicionar('Suporte para notebook');
  await expect(pedido.itens).toHaveCount(2);
  await expect(pedido.contador).toHaveText('3');
  await pedido.conferirTotais('R$ 205,00', 'Grátis', 'R$ 205,00');
  await pedido.diminuir('Mouse sem fio');
  await expect(pedido.item('Mouse sem fio').getByTestId('item-quantidade')).toHaveText('1');
  await expect(pedido.contador).toHaveText('2');
  await pedido.conferirTotais('R$ 125,00', 'R$ 25,00', 'R$ 150,00');
  await pedido.remover('Suporte para notebook');
  await expect(pedido.item('Suporte para notebook')).toHaveCount(0);
  await expect(pedido.contador).toHaveText('1');
  await pedido.conferirTotais('R$ 80,00', 'R$ 25,00', 'R$ 105,00');
  await pedido.diminuir('Mouse sem fio');
  await expect(pedido.itens).toHaveCount(0);
  await expect(page.getByTestId('pedido-vazio')).toBeVisible();
  await expect(pedido.contador).toHaveText('0');
  await pedido.conferirTotais('R$ 0,00', 'R$ 0,00', 'R$ 0,00');
});

for (const via of ['botão aumentar', 'catálogo']) {
  test(`RN07 - limita em 10 unidades via ${via}`, async ({ page }) => {
    const pedido = new PedidoPage(page);
    await pedido.adicionar('Mouse sem fio');
    for (let quantidade = 2; quantidade <= 10; quantidade++) {
      if (via === 'catálogo') await pedido.adicionar('Mouse sem fio');
      else await pedido.aumentar('Mouse sem fio');
      await expect(pedido.item('Mouse sem fio').getByTestId('item-quantidade')).toHaveText(String(quantidade));
    }
    await expect(pedido.itens).toHaveCount(1);
    await expect(pedido.contador).toHaveText('10');
    await pedido.conferirTotais('R$ 800,00', 'Grátis', 'R$ 800,00');
    if (via === 'catálogo') await pedido.adicionar('Mouse sem fio');
    else await pedido.aumentar('Mouse sem fio');
    await expect(pedido.item('Mouse sem fio').getByTestId('item-quantidade')).toHaveText('10');
    await expect(pedido.contador).toHaveText('10');
    await pedido.conferirTotais('R$ 800,00', 'Grátis', 'R$ 800,00');
  });
}

for (const caso of [
  { nome: 'abaixo de R$ 200,00', produtos: ['Mouse sem fio'], subtotal: 'R$ 80,00', frete: 'R$ 25,00', total: 'R$ 105,00' },
  { nome: 'exatamente R$ 200,00', produtos: ['Mouse sem fio', 'Teclado mecânico'], subtotal: 'R$ 200,00', frete: 'Grátis', total: 'R$ 200,00' },
  { nome: 'acima de R$ 200,00', produtos: ['Webcam Full HD'], subtotal: 'R$ 219,00', frete: 'Grátis', total: 'R$ 219,00' },
]) {
  test(`RN08 - frete com subtotal ${caso.nome}`, async ({ page }) => {
    const pedido = new PedidoPage(page);
    for (const produto of caso.produtos) await pedido.adicionar(produto);
    await expect(pedido.contador).toHaveText(String(caso.produtos.length));
    // RN08: subtotal >= R$ 200,00 tem frete grátis.
    await pedido.conferirTotais(caso.subtotal, caso.frete, caso.total);
  });
}
