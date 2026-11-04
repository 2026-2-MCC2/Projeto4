// Seletor de "modo de cor" genérico — mesmo conceito do Admin, mas sem
// depender de nenhuma classe CSS exclusiva do admin (usado em cliente,
// organizador e fornecedor).
export function SeletorTema({ temas, selecionado, aoSelecionar, nomeGrupo = 'tema' }) {
  return (
    <fieldset className="seletor-tema">
      <legend>Modo de cor</legend>
      <div className="seletor-tema__opcoes">
        {temas.map((tema) => (
          <label className="seletor-tema__opcao" key={tema.id}>
            <input
              type="radio"
              name={nomeGrupo}
              value={tema.id}
              checked={selecionado === tema.id}
              onChange={() => aoSelecionar(tema.id)}
            />
            <span className="seletor-tema__amostras" aria-hidden="true">
              {tema.cores.map((cor) => (
                <span key={cor} style={{ backgroundColor: cor }} />
              ))}
            </span>
            <span className="seletor-tema__texto">
              <strong>{tema.nome}</strong>
              <small>{tema.descricao}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
