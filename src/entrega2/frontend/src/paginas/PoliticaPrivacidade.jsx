import { Cabecalho } from '../componentes/publico/Cabecalho'
import { Rodape } from '../componentes/publico/Rodape'

export function PoliticaPrivacidade() {
  return (
    <>
      <Cabecalho />

      <main>
        <section>
          <h1>Política de Privacidade</h1>
          <p>Última atualização: novembro de 2026.</p>

          <p>
            Esta Política de Privacidade explica como a TrocaTicket coleta, usa e protege os
            dados pessoais de clientes, organizadores e fornecedores que utilizam a plataforma,
            em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>

          <h2>1. Dados que coletamos</h2>
          <p>
            Coletamos dados fornecidos no cadastro (nome, e-mail, telefone, CPF ou CNPJ e
            endereço, conforme o tipo de conta), dados de uso da plataforma (compras, anúncios
            de revenda, propostas enviadas) e registros de acesso para fins de segurança e
            auditoria.
          </p>

          <h2>2. Como usamos os dados</h2>
          <p>
            Os dados são usados para processar compras e revendas, validar cadastros de
            organizadores e fornecedores, calcular orçamentos de eventos, emitir ingressos e
            manter o histórico de transações protegido pela custódia da plataforma.
          </p>

          <h2>3. Compartilhamento</h2>
          <p>
            Não vendemos dados pessoais a terceiros. Informações de contato só são
            compartilhadas entre as partes de uma negociação quando estritamente necessário
            (por exemplo, entre organizador e fornecedor de uma proposta aceita).
          </p>

          <h2>4. Seus direitos</h2>
          <p>
            Você pode solicitar a qualquer momento a confirmação, correção ou exclusão dos seus
            dados pessoais, conforme previsto na LGPD, entrando em contato com nosso suporte.
          </p>

          <h2>5. Segurança</h2>
          <p>
            Senhas são armazenadas com hash criptográfico e o acesso à plataforma é protegido
            por autenticação baseada em token. Trabalhamos continuamente para manter a
            infraestrutura segura.
          </p>
        </section>
      </main>

      <Rodape />
    </>
  )
}
