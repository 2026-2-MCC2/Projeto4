# P.I_Projeto-Web — InterLink

Esta pasta reúne os artefatos da disciplina **Projeto Integrador (P.I.) — Projeto Web** referentes à **Entrega 1** do projeto **InterLink**, plataforma de organização e venda de ingressos para eventos que conecta **Organizadores**, **Fornecedores** de produtos/serviços e **Clientes**.

## 📄 Conteúdo desta pasta

| Arquivo | Descrição |
|---|---|
| [`InterLink-Figma.pdf`](./InterLink-Figma.pdf) | Protótipo de telas do projeto, exportado do Figma. Apresenta o design das principais telas do sistema (login, cadastro, eventos, ingressos, painéis de administrador, organizador e fornecedor) antes da implementação em código. |

## 💻 Implementação (código-fonte)

O protótipo acima foi implementado em HTML/CSS/JS estático, disponível em [`src/entrega1/frontend`](../../../src/entrega1/frontend):

```
src/entrega1/frontend/
├── index.html                  # Página inicial
├── servidor-estatico.js        # Servidor HTTP simples para servir os arquivos localmente
├── contas-teste.json           # Contas de exemplo para testar cada tipo de usuário
├── pages/
│   ├── login.html
│   ├── cadastro.html
│   ├── eventos.html
│   ├── ingressos-revenda.html
│   ├── admin/                  # Telas do painel de Administrador
│   │   ├── dashboard.html
│   │   ├── usuarios.html
│   │   ├── tickets.html
│   │   ├── papeis.html
│   │   ├── logs.html
│   │   ├── monitoramento.html
│   │   └── configuracoes.html
│   └── css/
│       └── style.css
└── images/
```

### ▶️ Como executar localmente

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. No terminal, acesse a pasta do frontend:
   ```sh
   cd src/entrega1/frontend
   ```
3. Inicie o servidor estático:
   ```sh
   node servidor-estatico.js
   ```
4. Acesse [http://localhost:3000/](http://localhost:3000/) no navegador.

### 👤 Contas de teste

O arquivo [`contas-teste.json`](../../../src/entrega1/frontend/contas-teste.json) traz uma conta de exemplo para cada tipo de usuário (cliente, organizador, fornecedor e administrador). Ele é apenas uma referência para navegação manual pelas telas — os formulários de login ainda não fazem validação real, o que será implementado junto ao backend.

## 📋 Observação

Esta é uma entrega inicial (protótipo + telas estáticas), sem integração com banco de dados ou backend. A modelagem do banco de dados do projeto está documentada separadamente em [`domentos/entrega2/BD`](../../entrega2/BD/README.md).

---
[⬅️ Voltar ao README principal](../../../README.md)
