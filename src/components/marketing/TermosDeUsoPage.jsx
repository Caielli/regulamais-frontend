import React, { useEffect } from 'react';
import { FileText, Users, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TermosDeUsoPage = () => {
  useEffect(() => {
    // Scroll para o topo quando a página carrega
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Termos de Uso
          </h1>
          <p className="text-xl text-blue-100">
            Condições gerais para uso da plataforma Regula Mais
          </p>
          <p className="text-blue-200 mt-2">
            Última atualização: Janeiro de 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introdução */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Aceitação dos Termos</h2>
            </div>
            <div className="prose prose-lg text-gray-700">
              <p>
                Bem-vindo ao Regula Mais! Estes Termos de Uso ("Termos") regem o uso da nossa plataforma 
                de gestão de qualidade e marketplace B2B. Ao acessar ou usar nossos serviços, você concorda 
                em ficar vinculado a estes Termos.
              </p>
              <p>
                Se você não concordar com qualquer parte destes Termos, não poderá acessar ou usar nossos serviços. 
                Estes Termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou usam o serviço.
              </p>
            </div>
          </div>

          {/* Definições */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Definições</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Plataforma</h3>
                  <p className="text-sm text-gray-700">
                    O sistema Regula Mais, incluindo website, aplicações móveis e todos os serviços relacionados.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Usuário</h3>
                  <p className="text-sm text-gray-700">
                    Qualquer pessoa física ou jurídica que acesse ou utilize a Plataforma.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Empresa</h3>
                  <p className="text-sm text-gray-700">
                    Organização que utiliza a Plataforma para gerenciar fornecedores e processos de qualidade.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Fornecedor</h3>
                  <p className="text-sm text-gray-700">
                    Pessoa física ou jurídica que oferece produtos ou serviços através da Plataforma.
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Marketplace</h3>
                  <p className="text-sm text-gray-700">
                    Ambiente digital que conecta Empresas e Fornecedores para transações comerciais.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Conteúdo</h3>
                  <p className="text-sm text-gray-700">
                    Todas as informações, dados, textos, documentos e materiais disponibilizados na Plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Elegibilidade */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Elegibilidade e Cadastro</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Requisitos para Uso</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Ter pelo menos 18 anos de idade ou ser uma pessoa jurídica devidamente constituída</li>
                  <li>• Possuir capacidade legal para celebrar contratos vinculativos</li>
                  <li>• Não estar suspenso ou banido da Plataforma</li>
                  <li>• Cumprir todas as leis e regulamentações aplicáveis</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Informações de Cadastro</h3>
                <p className="text-gray-700 mb-3">
                  Você se compromete a fornecer informações precisas, atuais e completas durante o processo de cadastro e a manter essas informações atualizadas.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dados pessoais ou empresariais verdadeiros</li>
                  <li>• Documentação válida e não fraudulenta</li>
                  <li>• Informações de contato funcionais</li>
                  <li>• Certificações e licenças válidas (quando aplicável)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Uso da Plataforma */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Uso Permitido da Plataforma</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Usos Permitidos</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Gerenciar documentos e certificações</li>
                  <li>• Conectar-se com fornecedores/empresas</li>
                  <li>• Realizar transações comerciais legítimas</li>
                  <li>• Acessar relatórios e análises</li>
                  <li>• Utilizar ferramentas de comunicação</li>
                  <li>• Participar do marketplace B2B</li>
                  <li>• Configurar alertas e notificações</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Usos Proibidos</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Fornecer informações falsas ou enganosas</li>
                  <li>• Violar direitos de propriedade intelectual</li>
                  <li>• Transmitir malware ou código malicioso</li>
                  <li>• Realizar atividades ilegais ou fraudulentas</li>
                  <li>• Interferir no funcionamento da Plataforma</li>
                  <li>• Coletar dados de outros usuários sem autorização</li>
                  <li>• Criar múltiplas contas para contornar restrições</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Marketplace */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Marketplace e Transações</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Natureza do Marketplace</h3>
                <p className="text-gray-700 mb-3">
                  O Regula Mais atua como intermediário, facilitando conexões entre Empresas e Fornecedores. 
                  Não somos parte das transações comerciais realizadas entre os usuários.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Facilitamos a descoberta e conexão entre partes</li>
                  <li>• Fornecemos ferramentas de comunicação e negociação</li>
                  <li>• Validamos documentações e certificações</li>
                  <li>• Não garantimos a conclusão de negócios</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Responsabilidades dos Usuários</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Empresas:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Definir requisitos claros</li>
                      <li>• Avaliar propostas de forma justa</li>
                      <li>• Cumprir acordos estabelecidos</li>
                      <li>• Pagar conforme acordado</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fornecedores:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Manter documentação atualizada</li>
                      <li>• Fornecer informações precisas</li>
                      <li>• Entregar conforme especificado</li>
                      <li>• Cumprir prazos acordados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Propriedade Intelectual */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">6. Propriedade Intelectual</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Propriedade da Plataforma</h3>
                <p className="text-gray-700">
                  A Plataforma Regula Mais, incluindo seu design, código-fonte, logotipos, marcas registradas 
                  e todo o conteúdo original, é de propriedade exclusiva da nossa empresa e está protegida 
                  por leis de direitos autorais e propriedade intelectual.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Conteúdo do Usuário</h3>
                <p className="text-gray-700 mb-3">
                  Você mantém a propriedade do conteúdo que carrega na Plataforma, mas nos concede uma 
                  licença limitada para processar, armazenar e exibir esse conteúdo conforme necessário 
                  para fornecer nossos serviços.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Você é responsável pelo conteúdo que compartilha</li>
                  <li>• Deve ter direitos legais sobre o conteúdo enviado</li>
                  <li>• Não deve violar direitos de terceiros</li>
                  <li>• Podemos remover conteúdo inadequado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacidade */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">7. Privacidade e Proteção de Dados</h2>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Sua privacidade é importante para nós. O tratamento de dados pessoais é regido por nossa 
                <a href="/politica-privacidade" className="text-blue-600 hover:underline font-medium"> Política de Privacidade</a>, 
                que faz parte integrante destes Termos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compromissos:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Conformidade com a LGPD</li>
                    <li>• Segurança dos dados</li>
                    <li>• Transparência no tratamento</li>
                    <li>• Respeito aos seus direitos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Seus Direitos:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Acesso aos seus dados</li>
                    <li>• Correção de informações</li>
                    <li>• Exclusão quando aplicável</li>
                    <li>• Portabilidade de dados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Limitação de Responsabilidade */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Limitação de Responsabilidade</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8.1 Limitações Gerais</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Na máxima extensão permitida por lei, não seremos responsáveis por:
                  </p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Danos indiretos, incidentais ou consequenciais</li>
                    <li>• Perda de lucros, dados ou oportunidades de negócio</li>
                    <li>• Ações ou omissões de outros usuários</li>
                    <li>• Falhas temporárias do sistema ou manutenção</li>
                    <li>• Decisões comerciais baseadas em informações da Plataforma</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8.2 Transações entre Usuários</h3>
                  <p className="text-gray-700 text-sm">
                    Não somos responsáveis por disputas, inadimplência, qualidade de produtos/serviços 
                    ou qualquer aspecto das transações realizadas entre usuários através da Plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suspensão e Encerramento */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <XCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">9. Suspensão e Encerramento</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Motivos para Suspensão</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Violação destes Termos</li>
                  <li>• Atividades fraudulentas ou ilegais</li>
                  <li>• Fornecimento de informações falsas</li>
                  <li>• Comportamento prejudicial a outros usuários</li>
                  <li>• Não pagamento de taxas devidas</li>
                  <li>• Uso inadequado da Plataforma</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Processo de Suspensão</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Notificação prévia quando possível</li>
                  <li>• Oportunidade de defesa</li>
                  <li>• Suspensão temporária ou permanente</li>
                  <li>• Possibilidade de recurso</li>
                  <li>• Preservação de dados conforme LGPD</li>
                  <li>• Encerramento de transações pendentes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alterações */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">10. Alterações nos Termos</h2>
            </div>
            
            <div className="prose prose-lg text-gray-700">
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações significativas 
                serão comunicadas com pelo menos 30 dias de antecedência através de e-mail ou notificação na Plataforma.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Processo de Alteração:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Notificação prévia de mudanças significativas</li>
                  <li>• Período de adaptação quando necessário</li>
                  <li>• Continuidade do uso implica aceitação</li>
                  <li>• Direito de encerrar conta se discordar</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lei Aplicável */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">11. Lei Aplicável e Jurisdição</h2>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa 
                relacionada a estes Termos será submetida à jurisdição exclusiva dos tribunais de São Paulo, SP.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legislação Aplicável:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Código Civil Brasileiro</li>
                    <li>• Código de Defesa do Consumidor</li>
                    <li>• Lei Geral de Proteção de Dados (LGPD)</li>
                    <li>• Marco Civil da Internet</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Resolução de Conflitos:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Tentativa de resolução amigável</li>
                    <li>• Mediação quando apropriada</li>
                    <li>• Arbitragem para disputas comerciais</li>
                    <li>• Foro de São Paulo, SP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Informações de Contato</h2>
            <p className="text-gray-700 mb-4">
              Para dúvidas sobre estes Termos de Uso ou questões relacionadas ao uso da Plataforma, 
              entre em contato conosco:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Atendimento Geral:</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li><strong>E-mail:</strong> contato@regulamais.com</li>
                  <li><strong>Telefone:</strong> (11) 9999-9999</li>
                  <li><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Questões Jurídicas:</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li><strong>E-mail:</strong> juridico@regulamais.com</li>
                  <li><strong>Endereço:</strong> São Paulo, SP</li>
                  <li><strong>CNPJ:</strong> [Número do CNPJ]</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded border">
              <p className="text-sm text-gray-600">
                <strong>Data de Vigência:</strong> Estes Termos de Uso entram em vigor em Janeiro de 2025 
                e permanecem válidos até serem substituídos por uma nova versão.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermosDeUsoPage;

