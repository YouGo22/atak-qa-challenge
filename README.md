# Portal de Pedidos — automação E2E

Etapas 1 a 3: testes das RN01 a RN12 com Playwright e TypeScript, incluindo login, catálogo, pedido, frete, cupom, checkout e logout.

## Preparação

Ambiente verificado: Node.js 22.23.1 e npm 10.9.8. Utilize Node.js 22 ou superior.

Obtenha o projeto pelo botão **Code → Download ZIP** no GitHub e extraia-o, ou copie a URL HTTPS em **Code** e execute `git clone URL_COPIADA` (substitua `URL_COPIADA` pela URL real do repositório). No terminal, acesse a pasta extraída ou clonada, por exemplo:

```text
cd atak-qa-challenge
```

Na raiz, onde está `package.json`, instale as dependências e o Chromium:

```text
npm ci
npx playwright install chromium
```

Em Linux, se faltarem bibliotecas do sistema, instale os requisitos do navegador conforme a documentação do Playwright (`npx playwright install --with-deps chromium`, que pode exigir privilégios administrativos).

Os comandos npm e npx documentados podem ser usados no Linux e no Windows (PowerShell ou Prompt de Comando). O servidor usa módulos nativos do Node.js, sem comandos de shell específicos do Linux. A execução no Windows ainda não foi validada.

## Execução

```bash
npm test
```

O Playwright inicia automaticamente o servidor Node.js em `http://127.0.0.1:4173`, aguarda a disponibilidade de `/portal-pedidos-qa.html`, executa os testes em Chromium e encerra o servidor. A porta deve estar livre. O servidor entrega o HTML original sem transformação.

O relatório nativo fica em `playwright-report/index.html`. Para abrir:

```bash
npm run report
```

Screenshots e traces das falhas ficam em `test-results/` e são acessíveis pelo relatório. Os artefatos gerados e as dependências estão no `.gitignore`. O Playwright transpila os testes TypeScript nativamente; esta etapa não inclui um compilador separado para checagem estática de tipos.

## Organização e cobertura

- `playwright.config.ts`: navegador, servidor, isolamento e relatórios.
- `scripts/serve.cjs`: servidor HTTP local usando somente módulos nativos do Node.js.
- `tests/pages/LoginPage.ts`: ações e seletores `data-testid` do login.
- `tests/e2e/login.spec.ts`: expectativas das RN01 a RN04, com contexto novo por teste.
- `tests/pages/PedidoPage.ts`: autenticação de preparação, carregamento observável do catálogo e ações reutilizáveis do pedido.
- `tests/e2e/pedido.spec.ts`: 20 testes independentes de catálogo, estoque, quantidades, contador e frete.
- `tests/pages/CheckoutPage.ts`: abertura, preenchimento válido e confirmação do checkout.
- `tests/e2e/checkout.spec.ts`: 17 testes independentes de RN08 a RN12.
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/`: oito screenshots preservados da execução anterior de 49 testes, associados aos cinco defeitos ainda presentes.
- `docs/PROMPTS_IA.md`: transcrição dos prompts fornecidos pelo usuário.
- `BUGS.md`: defeitos reproduzidos nesta etapa.

A suíte atual contém **51 testes**: 14 de login, 20 de catálogo/pedido e 17 de checkout/cupom/frete/logout. A última execução confirmada pelo usuário teve **43 aprovados e 8 reprovados**, em aproximadamente **1 minuto e 12 segundos**. Os novos cenários de RN08 (frete antes do desconto) e RN09 (somente um cupom por pedido) passaram.

Cobertura de checkout, cupom, frete e logout:

- RN08: cenário adicional com Webcam Full HD (R$ 219,00) e QA10: desconto de R$ 21,90, frete grátis e total de R$ 197,10, verificando a base de cálculo antes do desconto.
- RN09: três testes para cupom QA10, desconto de 10% sobre o subtotal, recálculo ao incrementar, remoção, rejeição de código inválido e limite de um cupom pela interface. Para aplicar novamente, é necessário remover o cupom atual; o desconto não deve acumular.
- RN10: nove testes que invalidam um requisito por vez, mantendo os demais válidos: nome vazio ou com dois caracteres, e-mail vazio ou malformado, CEP vazio, com seis ou sete dígitos, pagamento ausente e termos não aceitos.
- RN11: três testes de confirmação, um por pagamento, com nome no limite válido de três caracteres e CEP de oito dígitos. Verificam `/^PED-\d{6}$/`, carrinho vazio, contador, totais e finalização desabilitada.
- RN12: um teste de logout com itens e cupom, retorno ao login e novo acesso na mesma página, verificando descarte do pedido e desconto.

Não existem esperas fixas, retries, testes ignorados ou falhas marcadas como esperadas. A RN04 é interpretada literalmente: o usuário bloqueado deve receber a mensagem específica inclusive com senha vazia. Enquanto esse defeito persistir, a suíte deve retornar código diferente de zero.

## Integridade do HTML

SHA-256 registrado antes da implementação:

```text
9ea9f952d40a2c5bfb8d607b1fe94464ecafd671bf03b699626e9769dfa31505  portal-pedidos-qa.html
```

Confira no Linux com `sha256sum portal-pedidos-qa.html` ou no Windows PowerShell com `Get-FileHash .\portal-pedidos-qa.html -Algorithm SHA256`.

## Última execução confirmada

O resultado da última execução informado pelo usuário confirma **51 testes: 43 aprovados e 8 reprovados**, em aproximadamente **1 minuto e 12 segundos**, associados a cinco defeitos distintos: RN04 (1 falha), RN05 (3), RN07 (2), RN08 (1) e RN10 (1). Os detalhes e screenshots estão em [BUGS.md](BUGS.md).

As falhas são preservadas porque demonstram divergências das regras de negócio da aplicação. As asserções continuam exigindo o comportamento correto, sem `skip`, `fixme` ou marcação de falha esperada. Enquanto esses defeitos persistirem, `npm test` retornará código diferente de zero.

Os novos testes de RN08 (frete antes do desconto) e RN09 (somente um cupom por pedido) passaram. As oito imagens vinculadas em `BUGS.md` foram preservadas da execução anterior de 49 testes; o nome da pasta mantém essa origem histórica. Nenhuma nova execução foi realizada nesta preparação para publicação.

Cada teste recebe um contexto novo e faz sua própria preparação. O catálogo é aguardado por asserções sobre produtos e término do carregamento; a confirmação usa a visibilidade do sucesso, sem esperas fixas.

A listagem de coleta realizada na auditoria anterior identificou 51 testes; não foi repetida nesta preparação. O resultado acima é o da execução posterior informado pelo usuário.

## Preparação para publicação

Consulte [docs/PUBLICACAO.md](docs/PUBLICACAO.md) para o inventário e a seleção dos arquivos para o primeiro commit. Nenhum arquivo histórico foi excluído.
