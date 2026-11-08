# Defeitos da aplicação

Última execução confirmada pelo usuário: **51 testes, 43 aprovados e 8 reprovados**, em aproximadamente **1 minuto e 12 segundos**, correspondentes aos cinco defeitos abaixo. As falhas são mantidas para demonstrar divergências das regras de negócio. Os novos testes de RN08 (frete antes do desconto) e RN09 (somente um cupom por pedido) passaram. As imagens abaixo são evidências preservadas da execução anterior de 49 testes e mantêm seus caminhos originais.

## BUG-001 — RN04: usuário bloqueado com senha vazia recebe mensagem genérica

**Status:** permanece na última execução confirmada pelo usuário (51 testes, 43 aprovados e 8 reprovados).

**Regra violada:** RN04 — o usuário `bloqueado@teste.com` deve receber a mensagem “Usuário bloqueado”, independentemente da senha.

**Passos para reproduzir:**

1. Abrir a página de login em uma sessão nova.
2. Preencher o e-mail com `bloqueado@teste.com`.
3. Deixar a senha vazia.
4. Clicar em Entrar.

**Resultado esperado:** mensagem contendo “Usuário bloqueado” e permanência na tela de login.

**Resultado obtido:** mensagem “Informe e-mail e senha.”. No handler de login, a validação de campos obrigatórios retorna antes da verificação do usuário bloqueado.

**Teste correspondente:** `RN04 - informa usuário bloqueado com senha vazia`, em `tests/e2e/login.spec.ts`. A asserção exige a mensagem da RN04; não foi adaptada ao comportamento defeituoso.

**Observação de requisito:** esta análise aplica literalmente “independentemente da senha”, incluindo senha vazia. A RN02 também exige senha; se existir uma precedência de validações diferente, ela precisa ser esclarecida no requisito. A expectativa permanece conforme RN04 nesta implementação.

**Evidências da execução com 49 testes (41 aprovados e 8 reprovados):**

- [BUG-001_RN04_usuario-bloqueado-senha-vazia.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-001_RN04_usuario-bloqueado-senha-vazia.png)

## BUG-002 — RN05: busca diferencia maiúsculas de minúsculas

**Status:** permanece na última execução confirmada pelo usuário (51 testes, 43 aprovados e 8 reprovados).

**Passos para reprodução:** autenticar, aguardar o catálogo e buscar `teclado`, `TECLADO` ou `tEcLaDo`.

**Resultado esperado:** somente “Teclado mecânico” nas três buscas, conforme RN05.

**Resultado obtido:** nenhum resultado, pois usa `p.nome.indexOf(termo)` sem normalizar a caixa. A busca `Teclado` é o controle positivo.

**Regra violada:** RN05 — busca sem diferenciação de maiúsculas/minúsculas.

**Testes:** `RN05 - busca sem diferenciar caixa: ...` em `tests/e2e/pedido.spec.ts`.

**Evidências da execução com 49 testes (41 aprovados e 8 reprovados):**

- [BUG-002_RN05_busca-maiusculas.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-002_RN05_busca-maiusculas.png)
- [BUG-002_RN05_busca-caixa-mista.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-002_RN05_busca-caixa-mista.png)
- [BUG-002_RN05_busca-minusculas.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-002_RN05_busca-minusculas.png)

## BUG-003 — RN07: permite 11 unidades do mesmo produto

**Status:** permanece na última execução confirmada pelo usuário (51 testes, 43 aprovados e 8 reprovados).

**Passos para reprodução:** adicionar Mouse sem fio, alcançar 10 unidades e tentar adicionar outra pelo botão aumentar ou pelo catálogo.

**Resultado esperado:** permanecer com 10 unidades, contador 10 e subtotal R$ 800,00.

**Resultado obtido:** quantidade 11, contador 11 e subtotal R$ 880,00. A guarda verifica `item.qtd > MAX_QTD` antes do incremento, permitindo ultrapassar o limite quando a quantidade atual é 10.

**Regra violada:** RN07 — máximo de 10 unidades por produto.

**Testes:** `RN07 - limita em 10 unidades via botão aumentar` e `RN07 - limita em 10 unidades via catálogo`.

**Evidências da execução com 49 testes (41 aprovados e 8 reprovados):**

- [BUG-003_RN07_quantidade-via-botao-aumentar.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-003_RN07_quantidade-via-botao-aumentar.png)
- [BUG-003_RN07_quantidade-via-catalogo.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-003_RN07_quantidade-via-catalogo.png)

## BUG-004 — RN08: cobra frete no limite de R$ 200,00

**Status:** permanece na última execução confirmada pelo usuário (51 testes, 43 aprovados e 8 reprovados).

**Passos para reprodução:** adicionar um Mouse sem fio (R$ 80,00) e um Teclado mecânico (R$ 120,00).

**Resultado esperado:** subtotal R$ 200,00, frete grátis e total R$ 200,00; RN08 usa “a partir de R$ 200,00”.

**Resultado obtido:** frete R$ 25,00 e total R$ 225,00, porque a condição usa `subtotal > LIMITE_FRETE`.

**Regra violada:** RN08 — frete grátis a partir de R$ 200,00.

**Teste:** `RN08 - frete com subtotal exatamente R$ 200,00`.

**Evidências da execução com 49 testes (41 aprovados e 8 reprovados):**

- [BUG-004_RN08_frete-subtotal-200-reais.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-004_RN08_frete-subtotal-200-reais.png)

## BUG-005 — RN10: CEP com sete dígitos pode confirmar pedido

**Status:** permanece na última execução confirmada pelo usuário (51 testes, 43 aprovados e 8 reprovados).

**Passos para reprodução:** autenticar, adicionar Mouse sem fio, finalizar pedido, preencher nome `Ana`, e-mail `ana@teste.com`, CEP `1234567`, selecionar Pix, aceitar os termos e confirmar.

**Resultado esperado:** erro “Informe um CEP válido com 8 dígitos.”, sem confirmar nem esvaziar o pedido.

**Resultado obtido:** erro de CEP permanece oculto, pedido é confirmado com número e carrinho é esvaziado. A condição `cep.length < 7` não rejeita sete dígitos e permite confirmar.

**Regra violada:** RN10 — CEP deve conter exatamente oito dígitos.

**Teste:** `RN10 - valida individualmente CEP com sete dígitos`, em `tests/e2e/checkout.spec.ts`.

**Evidências da execução com 49 testes (41 aprovados e 8 reprovados):**

- [BUG-005_RN10_cep-sete-digitos.png](evidencias/execucao-49-testes-41-aprovados-8-reprovados/BUG-005_RN10_cep-sete-digitos.png)

## Preservação das evidências históricas — 49 testes

Resultado anterior informado pelo usuário: **49 testes, 41 aprovados e 8 reprovados**, correspondentes a cinco defeitos: BUG-001 (1), BUG-002 (3), BUG-003 (2), BUG-004 (1) e BUG-005 (1). O arquivo `test-results/.last-run.json` registra oito testes com falha; foram encontrados e copiados os oito screenshots correspondentes.

As cópias estão em `evidencias/execucao-49-testes-41-aprovados-8-reprovados/`, com nomes por bug e cenário e links nas respectivas seções. A identidade entre cada origem e sua cópia foi verificada por SHA-256. Todas as evidências anteriores foram mantidas. O `.gitignore` não exclui `evidencias/`. O HTML e as asserções que detectam os cinco defeitos foram preservados. Na execução posterior de 51 testes, os dois cenários adicionais passaram, conforme informado pelo usuário. Esta revisão não executou a suíte.
