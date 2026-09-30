import { Link } from 'react-router-dom'
import { Cabecalho } from '../componentes/publico/Cabecalho'
import { Rodape } from '../componentes/publico/Rodape'

export function Inicio() {
  return (
    <>
      <Cabecalho />

      <main>
        <section>
          <h1>Seu ingresso, seu evento, sua escolha.</h1>
          <p>
            Encontre ingressos para eventos, compre com segurança ou revenda
            aquele ingresso que você não poderá mais usar.
          </p>
          <Link to="/login"> Encontrar eventos </Link>
        </section>

        <section>
          <h2>Eventos em destaque</h2>
          <article>
            <img src="/images/eventos/evento-1.jpg" alt="Imagem do evento" />
            <h3>Nome do Evento</h3>
            <p>São Paulo - SP</p>
            <p>15 de outubro de 2026</p>
            <Link to="/login"> Ver evento </Link>
          </article>

          <article>
            <img src="/images/eventos/evento-4.jpg" alt="Imagem do evento" />
            <h3>Outro Evento</h3>
            <p>São Paulo - SP</p>
            <p>22 de outubro de 2026</p>
            <Link to="/login"> Ver evento </Link>
          </article>
        </section>

        <section>
          <h2>Compre ou revenda seu ingresso</h2>
          <div>
            <h3>Comprar ingresso</h3>
            <p>
              Encontre eventos e compre seus ingressos de forma segura pela
              plataforma.
            </p>
            <Link to="/eventos"> Comprar ingresso </Link>
          </div>

          <div>
            <h3>Revender ingresso</h3>
            <p>
              Não poderá mais ir ao evento? Coloque seu ingresso para
              revenda.
            </p>
            <Link to="/revenda"> Revender ingresso </Link>
          </div>
        </section>

        <section>
          <h2>Sobre o Trocaticket</h2>
          <p>
            O TrocaTicket nasceu para resolver a dor de cabeça da compra e
            revenda de ingressos de última hora. Acabamos com os golpes de
            ingressos duplicados através de validação criptografada e
            tecnologia de ponta, tornando o mercado secundário transparente,
            ético e confiável para produtores e fãs.
          </p>
          <div>
            <h3>100%</h3>
            <p>Ingressos Verificados</p>
          </div>
          <div>
            <h3>+120k</h3>
            <p>Fãs Atendidos</p>
          </div>
          <div>
            <h3>0%</h3>
            <p>Riscos de Fraude</p>
          </div>
          <div>
            <h3>24/7</h3>
            <p>Suporte</p>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}
