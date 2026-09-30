import { membrosSuperAdmin, permissoesSuperAdmin, perfis } from '../../dados/admin'
import { CabecalhoPagina } from '../../componentes/admin/layout'
import {
  Avatar,
  Botao,
  CabecalhoPainel,
  Chip,
  Dica,
  ListaChip,
  Painel,
  RodapePainel,
  Tag,
} from '../../componentes/admin/primitivos'
import { GradePerfis, TabelaPermissoes } from '../../componentes/admin/dados'

export function AdminPapeis() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Governança & Segurança"
        titulo="Papéis e Permissões"
        descricao="Defina níveis de acesso granulares, gerencie privilégios por módulo e atribua funções a equipes e colaboradores com proteção em custódia."
      />

      <Painel>
        <CabecalhoPainel titulo="Perfis do Sistema">
          <Tag tom="info">5 ativos</Tag>
        </CabecalhoPainel>
        <GradePerfis perfis={perfis} />
      </Painel>

      <div className="admin-grid">
        <div className="admin-col-main">
          <Painel>
            <CabecalhoPainel
              titulo="Permissões: Administrador (Super Admin)"
              descricao="Acesso irrestrito a configurações de infraestrutura, auditoria de transações e controle de usuários."
            />
            <TabelaPermissoes permissoes={permissoesSuperAdmin} />
            <RodapePainel>
              <Botao>Restaurar Padrão</Botao>
              <Botao variante="primario">Salvar Alterações</Botao>
            </RodapePainel>
          </Painel>
        </div>

        <div className="admin-col-side">
          <Painel>
            <h2>Proteção Granular</h2>
            <p>
              Alterações de privilégios em "Custódia" e "Logs de Auditoria"
              requerem dupla autenticação física (FIDO2 / 2FA).
            </p>
          </Painel>

          <Painel>
            <h2>Atribuir papel a usuários</h2>
            <p>
              Pessoas que herdam diretamente as capacidades deste perfil no
              ecossistema — 2 selecionados de 5.
            </p>
            <ListaChip>
              {membrosSuperAdmin.map((membro) => (
                <Chip key={membro.nome}>
                  <Avatar iniciais={membro.iniciais} tamanho="sm" /> {membro.nome}
                </Chip>
              ))}
            </ListaChip>
            <input
              type="text"
              placeholder="+ Adicionar usuário (digite nome ou e-mail)..."
              aria-label="Adicionar usuário ao perfil"
            />
            <Dica>
              Usuários adicionados terão acesso imediato após a próxima
              reautenticação de sessão.
            </Dica>
          </Painel>
        </div>
      </div>
    </>
  )
}
