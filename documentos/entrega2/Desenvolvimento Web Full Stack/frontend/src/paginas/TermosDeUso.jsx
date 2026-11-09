import { Cabecalho } from '../componentes/publico/Cabecalho'
import { Rodape } from '../componentes/publico/Rodape'

export function TermosDeUso() {
  return (
    <>
      <Cabecalho />

      <main>
        <section>
          <h1>Termos de Uso</h1>
          <p>Última atualização: novembro de 2026.</p>

          <p>
            Estes Termos de Uso regulam o acesso e a utilização da plataforma TrocaTicket,
            um marketplace que conecta clientes, organizadores de eventos e fornecedores de
            serviços para a venda e revenda de ingressos.
          </p>

          <h2>1. Cadastro e contas</h2>
          <p>
            Para usar a plataforma, é necessário criar uma conta informando dados verdadeiros.
            Cadastros de organizador e fornecedor passam por aprovação administrativa antes de
            serem liberados. Você é responsável por manter sua senha em sigilo e por toda a
            atividade realizada na sua conta.
          </p>

          <h2>2. Compra e revenda de ingressos</h2>
          <p>
            Ingressos comprados na plataforma ficam protegidos por um sistema de custódia: o
            valor pago só é liberado ao vendedor após a confirmação de que o acesso ao evento
            foi validado. Clientes podem revender ingressos que não poderão mais usar, definindo
            livremente o preço de revenda ou negociando por meio de contrapropostas.
          </p>

          <h2>3. Organizadores e fornecedores</h2>
          <p>
            Organizadores são responsáveis pelas informações do evento, pela definição de preços
            e pela quantidade de ingressos disponibilizados. Fornecedores enviam propostas para
            itens de custo dos eventos e são responsáveis pela qualidade dos serviços oferecidos.
          </p>

          <h2>4. Conduta do usuário</h2>
          <p>
            É proibido usar a plataforma para fraude, revenda enganosa, divulgação de ingressos
            falsos ou qualquer prática que viole a legislação aplicável. Contas que violarem
            estas regras podem ser suspensas ou encerradas pela administração.
          </p>

          <h2>5. Alterações destes termos</h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento para refletir mudanças na
            plataforma. Recomendamos revisar esta página periodicamente.
          </p>
        </section>
      </main>

      <Rodape />
    </>
  )
}
