import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/cliente'

const ROTULOS_STATUS = {
  rascunho: 'Rascunho',
  aberto: 'Em cotação',
  fechado: 'Fechado',
  cancelado: 'Cancelado',
}

export function OrganizadorInicio() {
  const [busca, setBusca] = useState('')
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    api.get('/api/eventos')
      .then((dados) => {
        if (ativo) setEventos(Array.isArray(dados) ? dados : [])
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const lista = useMemo(
    () =>
      eventos.filter((e) =>
        `${e.nome} ${e.local}`.toLowerCase().includes(busca.toLowerCase())
      ),
    [busca, eventos]
  )

  return (
    <section>
      <div className="org-titulo">
        <div>
          <small>PAINEL DO ORGANIZADOR</small>
          <h1>Meus eventos</h1>
          <p>Gerencie o planejamento, os custos e as propostas de cada evento.</p>
        </div>
        <Link className="org-botao" to="/organizador/criar-evento">
          + Criar evento
        </Link>
      </div>

      <div className="org-lista-topo">
        <h2>Seus eventos</h2>
        <input
          aria-label="Buscar evento"
          placeholder="Buscar por nome ou local..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && <p>Carregando eventos...</p>}
      {erro && <p className="org-aviso">{erro}</p>}

      {!carregando && !erro && (
        <div className="org-eventos">
          {lista.map((e) => (
            <article className="org-card" key={e.id_evento}>
              <div className="org-card-topo">
                <span className={e.status === 'rascunho' ? 'org-status rascunho' : 'org-status'}>
                  {ROTULOS_STATUS[e.status] || e.status}
                </span>
                <span>{e.total_itens ?? 0} item(ns) de custo</span>
              </div>
              <h3>{e.nome}</h3>
              <p>{e.data} · {e.local}</p>
              <div className="org-acoes">
                <Link className="org-botao secundario" to={`/organizador/evento/${e.id_evento}`}>
                  Gerenciar
                </Link>
              </div>
            </article>
          ))}
          {!lista.length && <p>Nenhum evento encontrado.</p>}
        </div>
      )}
    </section>
  )
}
