# Preparação para publicação

Revisão de 08/11/2026, sem executar ou coletar testes, instalar dependências, excluir arquivos ou publicar.

## Resultado e integridade

Última execução informada pelo usuário: **51 testes, 43 aprovados e 8 reprovados**, aproximadamente 1min12s. RN08 (frete antes do desconto) e RN09 (um cupom) passaram. As oito falhas correspondem a RN04 (1), RN05 (3), RN07 (2), RN08 (1) e RN10 (1).

Os cinco defeitos estão descritos em BUGS.md, com oito links relativos existentes para imagens PNG. As imagens mantêm a origem da execução de 49 testes; não foram renomeadas como evidências da execução de 51 testes.

SHA-256 do HTML conferido e idêntico ao registro anterior:
`9ea9f952d40a2c5bfb8d607b1fe94464ecafd671bf03b699626e9769dfa31505`.

PROMPTS_IA.md possui os oito registros anteriores e o novo prompt 9 integral. Os anteriores foram revisados quanto à sequência e disponibilidade no arquivo. Não há transcrição externa acessível para certificar retroativamente sua fidelidade integral; nenhum texto anterior foi inventado ou reescrito.

## Configuração revisada

- `.gitignore` exclui dependências, saídas do Playwright, caches, logs e arquivos de ambiente, preservando `evidencias/`, documentos, fontes e lockfile.
- `package.json` e a entrada raiz do lockfile v3 possuem as mesmas dependências e versões declaradas. As versões instaladas de `@playwright/test` (1.64.1) e `@types/node` (26.6.5) coincidem com o lockfile.
- Node.js 22.23.1 e npm 10.9.8 disponíveis. `node --check scripts/serve.cjs` passou.
- Comandos conferidos com os scripts e configuração locais: `npm ci`, `npx playwright install chromium`, `npm test` e `npm run report`. O servidor inicia automaticamente na porta 4173. Não foi feita instalação limpa nesta revisão.
- Os comandos são utilizáveis em Linux e Windows; execução no Windows permanece sem validação prática. Os oito testes com defeitos devem produzir saída diferente de zero.

## Inventário e proposta de evidências

Há 42 PNGs, com 18 conteúdos distintos por SHA-256: 24 cópias redundantes além da primeira ocorrência de cada conteúdo. Evidências diferentes por hash não foram tratadas como duplicatas exatas.

| Caminho | Conteúdo | Proposta, sujeita a autorização |
| --- | --- | --- |
| `evidencias/execucao-49-testes-41-aprovados-8-reprovados/` | 8 imagens, cerca de 606 kB | Publicar as oito, mantendo nomes e links |
| `evidencias/etapa-1/` | 1 imagem histórica distinta | Arquivar fora da entrega |
| `evidencias/etapa-2/` | 7 imagens idênticas às canônicas | Arquivar fora da entrega |
| `evidencias/etapa-3-antes-correcao/` | 80 arquivos, cerca de 28,9 MB: relatórios, traces e screenshots | Arquivar fora da entrega; inclui falhas das expectativas de desconto já corrigidas |
| `evidencias/test-failed-2.png` até `test-failed-7.png` | 6 imagens de nomes genéricos, todas distintas por hash | Arquivar fora da entrega; origem não comprovada pelos nomes |
| `prompts.odt` | Arquivo vazio (0 bytes) | Omitir da entrega, após autorização |

Estrutura final proposta: manter somente a pasta `evidencias/execucao-49-testes-41-aprovados-8-reprovados/` e suas oito imagens dentro de `evidencias/`. O nome histórico evita atribuir capturas antigas à execução nova. Nenhum arquivamento, exclusão ou alteração de ignore foi aplicado para implementar essa proposta.

### Duplicatas das imagens canônicas

- `BUG-001_RN04_usuario-bloqueado-senha-vazia.png`: `evidencias/etapa-2/login-RN04---informa-usuário-bloqueado-com-senha-vazia-chromium/test-failed-1.png`; `evidencias/etapa-3-antes-correcao/playwright-report/data/bb13684d93c8c619956af785638cac65bcf7698c.png`; `evidencias/etapa-3-antes-correcao/test-results/login-RN04---informa-usuário-bloqueado-com-senha-vazia-chromium/test-failed-1.png`.
- `BUG-002_RN05_busca-caixa-mista.png`: `evidencias/etapa-2/pedido-RN05---busca-sem-diferenciar-caixa-tEcLaDo-chromium/test-failed-1.png`; `evidencias/etapa-3-antes-correcao/playwright-report/data/47bad5b879153cc0185febc10fb37588c9154c55.png`; `evidencias/etapa-3-antes-correcao/test-results/pedido-RN05---busca-sem-diferenciar-caixa-tEcLaDo-chromium/test-failed-1.png`.
- `BUG-002_RN05_busca-maiusculas.png`: `evidencias/etapa-2/pedido-RN05---busca-sem-diferenciar-caixa-TECLADO-chromium/test-failed-1.png`; `evidencias/etapa-3-antes-correcao/playwright-report/data/89f01c4e97ee735d4d6703a74212e97423434263.png`; `evidencias/etapa-3-antes-correcao/test-results/pedido-RN05---busca-sem-diferenciar-caixa-TECLADO-chromium/test-failed-1.png`.
- `BUG-002_RN05_busca-minusculas.png`: `evidencias/etapa-2/pedido-RN05---busca-sem-diferenciar-caixa-teclado-chromium/test-failed-1.png`; `evidencias/etapa-3-antes-correcao/playwright-report/data/77c98c5755289b46a9eed435126c5630c9a9fb2b.png`; `evidencias/etapa-3-antes-correcao/test-results/pedido-RN05---busca-sem-diferenciar-caixa-teclado-chromium/test-failed-1.png`.
- `BUG-003_RN07_quantidade-via-botao-aumentar.png`: `evidencias/etapa-2/pedido-RN07---limita-em-10-unidades-via-botão-aumentar-chromium/test-failed-1.png`; `evidencias/etapa-3-antes-correcao/playwright-report/data/98c8b6dbd23ce1f1b0c9ce6ad889e70043a2b128.png`; `evidencias/etapa-3-antes-correcao/test-results/pedido-RN07---limita-em-10-unidades-via-botão-aumentar-chromium/test-failed-1.png`.
- `BUG-003_RN07_quantidade-via-catalogo.png`: `evidencias/etapa-2/pedido-RN07---limita-em-10-unidades-via-catálogo-chromium/test-failed-1.png`; `evidencias/etapa-3-antes-correcao/playwright-report/data/3544c59d3c9fd552bd077b1365096bf7d70c1a16.png`; `evidencias/etapa-3-antes-correcao/test-results/pedido-RN07---limita-em-10-unidades-via-catálogo-chromium/test-failed-1.png`.
- `BUG-004_RN08_frete-subtotal-200-reais.png`: `evidencias/etapa-2/pedido-RN08---frete-com-subtotal-exatamente-R-200-00-chromium/test-failed-1.png`; `evidencias/etapa-3-antes-correcao/playwright-report/data/4e7b6e9653243c6f0583eaabeae5ad76b08e9e55.png`; `evidencias/etapa-3-antes-correcao/test-results/pedido-RN08---frete-com-subtotal-exatamente-R-200-00-chromium/test-failed-1.png`.
- `BUG-005_RN10_cep-sete-digitos.png`: nenhuma cópia idêntica em evidencias/.

Outras duplicatas: as imagens de RN09, RN12 e RN10 em `etapa-3-antes-correcao/test-results/` possuem cópias idênticas em `etapa-3-antes-correcao/playwright-report/data/`. A imagem histórica de RN10 difere da canônica atual.

## Arquivos propostos para publicação

Na inspeção atual, `.git/` contém HEAD, configuração, hooks e estrutura de objetos e referências válidos. Não existem commits, referências ou objetos (soltos ou empacotados). Os metadados existentes foram preservados, sem necessidade de `git init`. A lista abaixo corresponde aos arquivos selecionados para o primeiro commit; nenhum commit ou push foi realizado.

- `.gitignore`
- `README.md`
- `BUGS.md`
- `docs/PROMPTS_IA.md`
- `docs/PUBLICACAO.md`
- `package.json`
- `package-lock.json`
- `playwright.config.ts`
- `tsconfig.json`
- `portal-pedidos-qa.html`
- `scripts/serve.cjs`
- `tests/e2e/checkout.spec.ts`
- `tests/e2e/login.spec.ts`
- `tests/e2e/pedido.spec.ts`
- `tests/pages/CheckoutPage.ts`
- `tests/pages/LoginPage.ts`
- `tests/pages/PedidoPage.ts`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-001_RN04_usuario-bloqueado-senha-vazia.png`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-002_RN05_busca-caixa-mista.png`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-002_RN05_busca-maiusculas.png`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-002_RN05_busca-minusculas.png`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-003_RN07_quantidade-via-botao-aumentar.png`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-003_RN07_quantidade-via-catalogo.png`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-004_RN08_frete-subtotal-200-reais.png`
- `evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-005_RN10_cep-sete-digitos.png`

Os históricos permanecem nos caminhos locais originais. O `.gitignore` exclui os históricos de evidências e `prompts.odt`, permitindo somente as oito imagens finais na pasta indicada. Dependências e saídas do Playwright também permanecem excluídas.

## Preparação atual e autorização pendente

A omissão dos históricos e de `prompts.odt` foi autorizada no prompt 10, registrado integralmente em `docs/PROMPTS_IA.md`. Os oito links de BUGS.md foram conferidos no disco e na seleção para publicação. O HTML mantém o SHA-256 registrado e os testes e Page Objects não foram alterados. Nenhum histórico foi excluído e nenhum teste foi executado.

O primeiro commit e o push dependem de autorização posterior do usuário.
