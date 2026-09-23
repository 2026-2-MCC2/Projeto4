        int id_item PK
        string nome
        int quantidade
    }
    EVENTOS_ITENS {
        int id_evento PK_FK
        int id_item PK_FK
        int quantidade_necessaria
    }
```

> O diagrama acima é renderizado automaticamente pelo GitHub (sintaxe [Mermaid](https://mermaid.js.org/)). Caso não seja exibido, veja a descrição textual completa das tabelas logo abaixo.

## 🗂️ Dicionário de Dados

### `USUARIOS`
Tabela base que representa qualquer pessoa cadastrada no sistema. É especializada (herança **total e disjunta**) em `ADMINISTRADORES`, `ORGANIZADORES`, `CLIENTES` e `FORNECEDORES` — ou seja, todo usuário é obrigatoriamente um, e apenas um, desses quatro papéis.

| Coluna | Tipo | Chave | Descrição |
|---|---|---|---|
| id_usuario | INT | PK | Identificador único do usuário |
| nome | VARCHAR | | Nome completo |
| email | VARCHAR | | E-mail de acesso (único) |
| telefone | VARCHAR | | Telefone de contato |

### `ADMINISTRADORES`
| Coluna | Tipo | Chave | Descrição |
|---|---|---|---|
| id_administrador | INT | PK | Identificador único do administrador |
| id_usuario | INT | FK → `USUARIOS.id_usuario` | Usuário correspondente |
| nivel_acesso | VARCHAR | | Nível de permissão do administrador no sistema (ex: master, suporte) |

### `ORGANIZADORES`
| Coluna | Tipo | Chave | Descrição |
|---|---|---|---|
| id_organizador | INT | PK | Identificador único do organizador |
| id_usuario | INT | FK → `USUARIOS.id_usuario` | Usuário correspondente |
| cnpj | VARCHAR | | CNPJ do organizador |
| endereco | VARCHAR | | Endereço do organizador |

### `CLIENTES`
| Coluna | Tipo | Chave | Descrição |
|---|---|---|---|
| id_cliente | INT | PK | Identificador único do cliente |
| id_usuario | INT | FK → `USUARIOS.id_usuario` | Usuário correspondente |
| cpf | VARCHAR | | CPF do cliente |

### `FORNECEDORES`
| Coluna | Tipo | Chave | Descrição |
|---|---|---|---|
| id_fornecedor | INT | PK | Identificador único do fornecedor |
| id_usuario | INT | FK → `USUARIOS.id_usuario` | Usuário correspondente |
| cnpj | VARCHAR | | CNPJ do fornecedor |
| endereco | VARCHAR | | Endereço do fornecedor |

### `EVENTOS`
| Coluna | Tipo | Chave | Descrição |
|---|---|---|---|
| id_evento | INT | PK | Identificador único do evento |
