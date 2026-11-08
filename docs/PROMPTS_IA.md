# Prompts utilizados na assistência de IA

Transcrição integral, em ordem cronológica, das mensagens de solicitação fornecidas pelo usuário nesta conversa. Os blocos preservam o texto e a formatação recebidos. O contexto técnico de ambiente enviado pela interface não é um prompt de solicitação. Nenhum prompt adicional foi enviado a agentes auxiliares.

## Prompt 1 — inspeção e planejamento

```text
Estou realizando um teste prático para uma vaga de Analista de Testes.

O projeto deve utilizar Playwright com TypeScript para automatizar testes E2E de uma aplicação local chamada portal-pedidos-qa.html.

Requisitos importantes:

Não modificar o arquivo HTML original.

Utilizar seletores data-testid sempre que possível.

Criar testes independentes e organizados.

Não utilizar esperas fixas como waitForTimeout.

Cobrir as regras de negócio RN01 a RN12.

Os testes devem falhar quando encontrarem defeitos reais na aplicação.

A suíte deve ser executada por um único comando documentado.

Criar README.md, BUGS.md e docs/PROMPTS_IA.md.

Registrar fielmente os prompts utilizados para assistência de IA.

Sua primeira tarefa:

Inspecionar o HTML original.

Identificar os requisitos e cenários de teste.

Propor uma arquitetura utilizando Page Objects.

Explicar como servir a aplicação HTML localmente para o Playwright.

Apresentar um plano de implementação por etapas.

Não crie nem modifique arquivos ainda. Aguarde minha autorização para implementar.
```

## Prompt 2 — autorização da etapa 1

```text
Aprovo o planejamento apresentado, com alguns ajustes.

Vamos implementar o projeto por etapas, priorizando os critérios eliminatórios do teste prático.

**Etapa 1: Configuração e login**

1. Inicialize o projeto Playwright com TypeScript.
2. Configure um servidor HTTP local iniciado automaticamente pelo Playwright.
3. Configure o comando `npm test` para executar a suíte.
4. Crie o LoginPage utilizando os seletores data-testid existentes.
5. Implemente testes independentes de login cobrindo RN01, RN02, RN03 e RN04.
6. Configure o relatório HTML nativo do Playwright.
7. Crie o arquivo docs/PROMPTS_IA.md e registre integralmente os prompts que eu forneci até agora, incluindo este.
8. Crie um .gitignore adequado.

Restrições:
- Não altere o HTML original.
- Não utilize esperas fixas.
- Não modifique as asserções para ocultar defeitos.
- Evite abstrações desnecessárias.
- Não implemente ainda catálogo, pedido, cupom ou checkout.
- Não execute comandos destrutivos.

Ao terminar, execute os testes e apresente:
- Quantidade de testes aprovados e reprovados.
- Motivo de cada reprovação.
- Arquivos criados.
- Comando para executar novamente.
- Confirmação de que o HTML original permaneceu intacto.

Antes de instalar dependências, confira as versões do Node.js e npm e confirme que está no diretório atak-qa-challenge.
```

## Prompt 3 — reprodução real da etapa 1 e autorização da etapa 2

```text
A Etapa 1 foi executada manualmente no terminal do Distrobox qa-dev com o comando npm test.

Resultado real:
- 14 testes executados.
- 13 aprovados.
- 1 reprovado na RN04: usuário bloqueado com senha vazia.
- Esperado: "Usuário bloqueado".
- Obtido: "Informe e-mail e senha.".
- Tempo total: 7,7 segundos.
- O servidor e o Chromium funcionaram corretamente fora do sandbox do Codex.

Atualize o BUGS.md para registrar essa reprodução real, indicando a possível ambiguidade com a RN02. Preserve o teste que falhou e não altere o HTML.

**Etapa 2: Catálogo, pedido e frete**

Implemente testes automatizados para RN05, RN06, RN07 e RN08, incluindo:

1. Esperar o carregamento assíncrono do catálogo sem esperas fixas.
2. Validar busca sem diferenciação entre maiúsculas e minúsculas.
3. Validar filtro por categoria e ordenação por preço.
4. Impedir adição de produtos sem estoque.
5. Adicionar, incrementar, decrementar e remover produtos.
6. Verificar quantidade mínima de 1 e máxima de 10 unidades.
7. Validar subtotal, frete e total.
8. Utilizar testes parametrizados para frete abaixo, exatamente em e acima de R$ 200,00.
9. Verificar o contador de itens do pedido.

Utilize Page Objects ou componentes reutilizáveis, mantendo os testes independentes e as expectativas das regras de negócio explícitas.

Restrições:
- Não modificar o HTML original.
- Não utilizar waitForTimeout ou esperas fixas.
- Não mascarar defeitos com asserções incorretas.
- Não modificar os testes de login sem justificativa.
- Registrar integralmente este prompt em docs/PROMPTS_IA.md.
- Não implementar ainda cupom, checkout ou logout.

Ao terminar, execute os testes disponíveis, quando o ambiente permitir, e apresente um resumo dos arquivos criados, testes implementados e possíveis defeitos.
```

## Prompt 4 — reprodução da etapa 2 e autorização da etapa 3

```text
A Etapa 2 foi executada no terminal do Distrobox qa-dev.

Resultado: 34 testes executados, 27 aprovados e 7 reprovados, em 45,5 segundos.

As falhas identificaram quatro defeitos distintos:
- BUG-001 / RN04: usuário bloqueado com senha vazia recebe "Informe e-mail e senha." em vez de "Usuário bloqueado".
- BUG-002 / RN05: busca não ignora maiúsculas/minúsculas.
- BUG-003 / RN07: quantidade chega a 11, ultrapassando o limite de 10.
- BUG-004 / RN08: subtotal exatamente R$ 200,00 recebe frete de R$ 25,00.

Primeiro, preserve as evidências dos testes reprovados existentes em test-results, copiando screenshots relevantes para a pasta evidencias. Atualize BUGS.md com título, passos para reprodução, resultado esperado, resultado obtido, regra violada e caminhos das evidências. Registre a ambiguidade entre RN02 e RN04 no BUG-001.

Depois, implemente a Etapa 3:

1. RN09: aplicar cupom QA10, validar desconto de 10%, rejeitar cupom inválido, remover cupom e verificar recálculo.
2. RN10: validar individualmente nome obrigatório e mínimo de 3 caracteres, e-mail válido, CEP com exatamente 8 dígitos, pagamento obrigatório e aceite dos termos.
3. RN11: confirmar pedido válido, validar número com expressão regular /^PED-\d{6}$/ e garantir que o carrinho seja esvaziado.
4. RN12: realizar logout com pedido em andamento, retornar ao login e verificar se o carrinho foi descartado após novo login.

Mantenha os testes independentes, utilize seletores estáveis e não use esperas fixas.

Não modifique o HTML original e não ajuste asserções para esconder defeitos.

Registre integralmente este prompt em docs/PROMPTS_IA.md.

Ao concluir, informe os arquivos criados ou modificados, os novos testes implementados e os resultados de execução disponíveis.
```

## Prompt 5 — revisão da execução e correção das expectativas de desconto

```text
Revise os resultados da última execução do Playwright.

Foram executados 49 testes: 39 aprovados e 10 reprovados.

Identifiquei que duas falhas são causadas por expectativas incorretas na automação:

1. RN09: o teste espera "R$ 8,00", mas a aplicação apresenta "− R$ 8,00". O sinal negativo é correto para representar o desconto.
2. RN12: o teste espera "R$ 16,00", mas a aplicação apresenta "− R$ 16,00". A falha ocorre antes da execução do logout.

Corrija somente essas asserções, incluindo outras verificações de desconto com o mesmo problema, preservando a validação dos valores e dos cálculos.

Depois:
- Revise se os testes RN09 e RN12 realmente verificam seus fluxos completos.
- Não altere o HTML original.
- Não modifique as asserções dos defeitos reais das RN04, RN05, RN07, RN08 e RN10.
- Não marque os testes com skip ou fixme.
- Atualize o BUGS.md para incluir a RN10 com CEP de sete dígitos.
- Não registre como bugs as falhas causadas exclusivamente por expectativas incorretas dos testes.
- Preserve screenshots existentes antes de qualquer execução que possa substituí-los.
- Registre integralmente este prompt em docs/PROMPTS_IA.md.

Ao terminar, apresente as alterações realizadas e informe como executar a suíte novamente.
```

## Prompt 6 — preservação das evidências da última execução

```text
Antes de iniciarmos a auditoria final, quero organizar e preservar as evidências da última execução do Playwright.

A última execução apresentou 49 testes, sendo 41 aprovados e 8 reprovados, correspondentes a cinco defeitos distintos.

Sua tarefa:

1. Localize os screenshots da última execução dentro de test-results/.
2. Crie a pasta evidencias/, caso ainda não exista.
3. Copie os screenshots relevantes para essa pasta, com nomes padronizados por bug e cenário.
4. Preserve as evidências dos cinco defeitos:
   - BUG-001 — RN04: usuário bloqueado com senha vazia.
   - BUG-002 — RN05: busca sensível a maiúsculas/minúsculas.
   - BUG-003 — RN07: quantidade ultrapassa 10 unidades.
   - BUG-004 — RN08: cobrança de frete com subtotal de R$ 200,00.
   - BUG-005 — RN10: CEP de sete dígitos aceito.
5. Atualize BUGS.md com os caminhos relativos dos screenshots, garantindo que os links Markdown funcionem no GitHub.
6. Verifique se a pasta evidencias/ não está excluída pelo .gitignore.
7. Não sobrescreva nem exclua evidências anteriores sem verificar seu conteúdo.
8. Registre integralmente este prompt em docs/PROMPTS_IA.md.

Não altere o HTML original nem as asserções dos testes.

Ao terminar, liste os screenshots preservados e confirme se cada bug possui pelo menos uma evidência visual. Não execute novamente a suíte nesta etapa.
```

## Prompt 7 — auditoria final antes da publicação

```text
Quero realizar a auditoria final do projeto Atak QA Challenge antes da publicação no GitHub.

A suíte possui 49 testes, sendo 41 aprovados e 8 reprovados por cinco possíveis defeitos da aplicação.

As evidências da última execução já foram preservadas e os links do BUGS.md foram atualizados.

Analise o projeto completo e verifique:

1. Se todos os critérios eliminatórios e desejáveis do enunciado estão atendidos.
2. Se o README.md permite instalar e executar o projeto do zero, incluindo o comando npm test.
3. Se BUGS.md descreve corretamente os cinco defeitos e contém links funcionais para os screenshots.
4. Se docs/PROMPTS_IA.md contém os prompts utilizados sem omissões ou informações inventadas.
5. Se o .gitignore está adequado e não exclui arquivos necessários à entrega.
6. Se existem arquivos temporários, duplicados ou históricos que não precisam ser publicados.
7. Se os testes são independentes, usam seletores estáveis e não utilizam esperas fixas.
8. Se o projeto utiliza boas práticas de Playwright e TypeScript, sem abstrações desnecessárias.
9. Se o HTML original permanece inalterado.
10. Se o repositório poderá ser executado por outro avaliador em Linux ou Windows.

Classifique os problemas encontrados por prioridade: crítico, importante ou melhoria opcional.

Não modifique nenhum arquivo e não execute novamente os testes. Apresente os resultados da auditoria e aguarde minha autorização antes de realizar correções.
```

## Prompt 8 — autorização dos ajustes da auditoria final

```text
Autorizo os ajustes identificados na auditoria final do Atak QA Challenge.

Priorize a qualidade da entrega e evite alterações desnecessárias.

1. Atualize README.md com os resultados da última execução confirmada: 49 testes, 41 aprovados, 8 reprovados e cinco defeitos distintos. Explique que as falhas são preservadas porque demonstram divergências das regras de negócio.

2. Atualize BUGS.md removendo informações desatualizadas sobre testes pendentes de execução. Mantenha os cinco bugs documentados, incluindo a ressalva sobre a interpretação das RN02 e RN04.

3. Revise os links dos screenshots e utilize preferencialmente as evidências da pasta evidencias/execucao-49-testes-41-aprovados-8-reprovados/.

4. Registre integralmente o prompt da auditoria anterior e este prompt em docs/PROMPTS_IA.md. Não invente prompts anteriores que não estejam disponíveis.

5. Adicione um cenário automatizado para RN08 verificando que o frete é calculado pelo subtotal antes do desconto. Use um produto com subtotal superior a R$ 200,00 e aplique QA10, verificando desconto, frete e total.

6. Revise a cobertura da RN09 para verificar que apenas um cupom pode ser aplicado por pedido, respeitando as interações disponíveis na interface.

7. Melhore o README com instruções para clonar ou baixar o repositório e executar npm ci, npx playwright install chromium e npm test.

8. Verifique a compatibilidade dos comandos documentados com Linux e Windows.

9. Identifique arquivos históricos e duplicados desnecessários para publicação. Não os exclua automaticamente; apresente uma lista para minha aprovação.

Restrições:
- Não alterar o HTML original.
- Não modificar as asserções que detectam defeitos reais.
- Não utilizar esperas fixas.
- Preservar os screenshots já organizados.
- Não executar comandos destrutivos.
- Não publicar no GitHub ainda.

Ao terminar, informe quais arquivos foram alterados, os novos testes adicionados e eventuais problemas encontrados. Não afirme que novos testes passaram sem executá-los.
```

## Prompt 9 — preparação para publicação no GitHub

```text
A última execução do Playwright terminou com 51 testes: 43 aprovados e 8 reprovados, em aproximadamente 1 minuto e 12 segundos.

Os dois novos testes de RN08 (frete antes do desconto) e RN09 (somente um cupom por pedido) passaram.

As oito falhas continuam associadas aos cinco defeitos já documentados: RN04, RN05, RN07, RN08 e RN10.

Prepare o projeto para publicação no GitHub:

1. Atualize README.md com o resultado confirmado de 51 testes, 43 aprovados e 8 reprovados.
2. Verifique que BUGS.md descreve os cinco defeitos e possui links válidos para as evidências preservadas.
3. Registre integralmente este prompt em docs/PROMPTS_IA.md e confira os registros anteriores disponíveis.
4. Identifique os arquivos históricos e duplicados em evidencias/ e proponha uma estrutura final enxuta, preservando as oito imagens associadas aos bugs.
5. Verifique .gitignore, package.json, package-lock.json e os comandos de instalação e execução.
6. Confira se o HTML original permanece inalterado.
7. Verifique git status e apresente quais arquivos serão publicados.
8. Não exclua arquivos nem publique no GitHub ainda.

Não modifique as asserções dos testes e não execute novamente a suíte. Informe o que foi atualizado e o que ainda requer minha autorização.
```

## Prompt 10 — preparação do primeiro commit

```text
Quero preparar o Atak QA Challenge para o primeiro commit no GitHub.

A auditoria identificou que a pasta .git está vazia ou incompleta.

Primeiro, inspecione a pasta .git e confirme se existe algum dado de Git a preservar. Caso esteja comprovadamente vazia, inicialize corretamente o repositório usando git init, sem apagar outros arquivos.

Para a publicação:
- Inclua o HTML original, testes Playwright, Page Objects, configurações, package.json, package-lock.json, README.md, BUGS.md, docs/PROMPTS_IA.md e as oito evidências finais referenciadas.
- Mantenha os históricos de evidências localmente, mas não os inclua no primeiro commit.
- Não inclua node_modules, playwright-report, test-results ou prompts.odt.
- Verifique se os links do BUGS.md continuam válidos.
- Verifique git status e apresente a lista de arquivos preparados para publicação.

Não execute os testes novamente.
Não altere o HTML original.
Não modifique as asserções.
Não exclua evidências históricas.
Não realize commit nem push nesta etapa.
Registre integralmente este prompt em docs/PROMPTS_IA.md.

Ao terminar, apresente o resultado do git status e aguarde minha autorização para realizar o primeiro commit.
```

## Prompt 11 — autorização do primeiro commit

```text
Autorizo realizar o primeiro commit do projeto Atak QA Challenge.

Antes do commit, confirme que os 25 arquivos preparados são exatamente os arquivos destinados à publicação e que não há arquivos sensíveis ou temporários incluídos.

Realize o commit com a mensagem:

test: adiciona suíte E2E Playwright para Portal de Pedidos

Depois execute git status e apresente o hash do commit criado.

Não execute os testes novamente, não altere o HTML original e não faça push ao GitHub ainda.

Registre este prompt em docs/PROMPTS_IA.md antes do commit, garantindo que o registro também esteja incluído no commit.
```
