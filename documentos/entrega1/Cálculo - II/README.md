# Cálculo II — InterLink

Esta pasta reúne os artefatos da disciplina **Cálculo II** referentes à **Entrega 1** do projeto **InterLink**, plataforma de organização e venda de ingressos para eventos.

## 📄 Conteúdo desta pasta

| Arquivo | Descrição |
|---|---|
| [`Interlink-Calculo-II.pdf`](./Interlink-Calculo-II.pdf) | Resolução do **Projeto 4 — Tempo de resposta**, aplicando **Polinômio de Taylor** para estimar o tempo de resposta do sistema. |

## 📐 Resumo da resolução

O exercício modela o tempo de resposta do sistema pela função `T(r) = √r`, onde `r` representa a carga/quantidade de requisições, e usa o **Polinômio de Taylor de 3º grau** em torno de `r₀ = 4` para estimar `T(4,2)` sem calcular a raiz diretamente — simulando, na prática, como o sistema poderia estimar rapidamente um tempo de resposta aproximado.

1. **Etapa 1 — Derivadas em r₀ = 4:** calcula `f(4)`, `f'(4)`, `f''(4)` e `f'''(4)` para `f(r) = √r`.
2. **Etapa 2 — Montagem de P₃(x):** monta o polinômio de Taylor de 3º grau a partir das derivadas:
   `P₃(r) = 2 + ¼(r−4) − 1/64(r−4)² + 1/512(r−4)³`
3. **Etapa 3 — Estimativa em r = 4,2:** substitui `r = 4,2` no polinômio, obtendo `P₃(4,2) ≈ 2,04939`.
4. **Etapa 4 — Comparação com o valor real e erro:** compara a estimativa com o valor real `T(4,2) = √4,2 ≈ 2,049390153`, resultando em um erro de aproximadamente `0,000000153`.
5. **Etapa 5 — Interpretação no contexto do TrocaTicket:** aplica o resultado ao contexto do sistema, mostrando que a aproximação por Taylor é extremamente precisa para estimar o tempo de resposta `T(r) = √r` sem a necessidade de calcular a raiz quadrada exata.

## 📋 Outras entregas relacionadas

- Site publicado: [`documentos/entrega1/Desenvolvimento Web Full Stack`](../Desenvolvimento%20Web%20Full%20Stack/README.md)
- Protótipo Figma: [`documentos/entrega1/P.I_Projeto-Web`](../P.I_Projeto-Web/README.md)
- Modelagem do banco de dados: [`documentos/entrega1/Projetos em Banco de Dados`](../Projetos%20em%20Banco%20de%20Dados/README.md)

---
[⬅️ Voltar ao README principal](../../../README.md)
