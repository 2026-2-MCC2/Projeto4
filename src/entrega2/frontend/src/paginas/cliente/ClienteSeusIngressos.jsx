import { useEffect, useState } from 'react'
import { ClienteHeader } from '../../componentes/cliente/ClienteHeader'
import { listarMeusIngressos } from '../../api/ingressos'
import { usuarioLogado } from '../../api/auth'

function formatarData(dataIso) {
  if (!dataIso) return ''
  return new Date(`${dataIso}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export function ClienteSeusIngressos() {
  const [lista, setLista] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const usuario = usuarioLogado()

  useEffect(() => {
    let cancelado = false
    listarMeusIngressos()
      .then((dados) => { if (!cancelado) setLista(dados) })
      .catch((erroRequisicao) => { if (!cancelado) setErro(erroRequisicao.message) })
      .finally(() => { if (!cancelado) setCarregando(false) })
    return () => { cancelado = true }
  }, [])

  const proximoEvento = [...lista].sort((a, b) => a.data.localeCompare(b.data))[0]

  return (
    <>
      <ClienteHeader
        titulo="Seus Ingressos"
        descricao="Visualize e gerencie todos os ingressos adquiridos e sob proteção de custódia."
        voltarParaPerfil
        nome={usuario?.nome}
      />

      <main className="cliente-main">
        <div className="cliente-aviso-custodia">
          🛡️
          <div>
            <strong>Resolução garantida 24/7.</strong>
            {' '}Nos ingressos com status "Em revenda", o anúncio criado por você fica visível até ser vendido ou cancelado.
          </div>
        </div>

        {proximoEvento && (
          <div className="cliente-proximo-evento">
            <div>
              <span>Próximo evento</span>
              <h2>{proximoEvento.nome}</h2>
              <p>{formatarData(proximoEvento.data)} • {proximoEvento.local}</p>
            </div>
          </div>
        )}

        <div className="cliente-lista-head">
          <div>
            <h2>Lista de Ingressos</h2>
            <p>{lista.length} ingresso{lista.length !== 1 ? 's' : ''} encontrado{lista.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {erro && (
          <div className="cliente-estado" role="alert">
            <p style={{ color: '#BE123C' }}>{erro}</p>
          </div>
        )}

        <div className="cliente-ingresso-lista">
          {carregando ? (
            <div className="cliente-estado"><p>Carregando ingressos...</p></div>
          ) : lista.length === 0 ? (
            <div className="cliente-estado"><p>Você ainda não comprou nenhum ingresso.</p></div>
          ) : (
            lista.map((item) => (
              <article className="cliente-ingresso-item" key={item.id_compra}>
                <img
                  className="cliente-ingresso-item__imagem"
                  src={item.imagem_url || `https://picsum.photos/seed/compra-${item.id_compra}/160/160`}
                  alt={item.nome}
                />
                <div className="cliente-ingresso-item__info">
                  <h3>{item.nome}</h3>
                  <p>{item.quantidade}x • {formatarData(item.data)} • {item.local}</p>
                  <div className="cliente-ingresso-item__tags">
                    <span className={`cliente-tag ${item.em_revenda ? 'cliente-tag--pendente' : 'cliente-tag--custodia'}`}>
                      {item.em_revenda ? 'Em revenda' : 'Válido'}
                    </span>
                  </div>
                </div>
                <div className="cliente-ingresso-item__acoes">
                  <strong>{Number(item.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </>
  )
}
