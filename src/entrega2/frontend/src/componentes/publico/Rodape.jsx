import { Link } from 'react-router-dom'

function Creditos() {
  return (
    <p>
      {' '}
      Site desenvolvido por{' '}
      <a href="https://www.linkedin.com/in/alanas-rocha/">Alana</a>,{' '}
      <a href="https://github.com/BrunaClara">Bruna</a>,{' '}
      <a href="www.linkedin.com/in/geovanna-tamagusko">Geovanna</a> e{' '}
      <a href="https://github.com/juliaandmed">Julia</a>.
    </p>
  )
}

export function Rodape() {
  return (
    <footer>
      <div>
        <img src="/images/logotipo_troca_ticket.png" alt="TrocaTicket" />
        <p> Venda e revenda de ingressos de forma segura. </p>
      </div>
      <div>
        <h3> TrocaTicket </h3>
        <Link to="/"> Início </Link>
        <Link to="/eventos"> Eventos </Link>
        <Link to="/login"> Entrar </Link>
        <Link to="/cadastro">Criar conta</Link>
      </div>
      <div>
        <h3>Ajuda</h3>
        <a href="#">Termos de uso </a>
        <a href="#"> Política de privacidade </a>
      </div>
      <p> &copy; 2026 TrocaTicket. Todos os direitos reservados.</p>
      <Creditos />
    </footer>
  )
}

export function RodapeSimples() {
  return (
    <footer>
      <p> &copy; 2026 TrocaTicket. Todos os direitos reservados.</p>
      <Creditos />
    </footer>
  )
}
