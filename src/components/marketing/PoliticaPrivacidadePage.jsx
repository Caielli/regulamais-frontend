import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';

const PoliticaPrivacidadePage = () => {
  useEffect(() => {
    // Scroll para o topo quando a página carrega
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Política de Privacidade
          </h1>
          <p className="text-xl text-blue-100">
            Transparência total sobre como protegemos e utilizamos seus dados
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
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Introdução</h2>
            </div>
            <div className="prose prose-lg text-gray-700">
              <p>
                A Regula Mais ("nós", "nosso" ou "empresa") está comprometida em proteger e respeitar sua privacidade. 
                Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações 
                quando você utiliza nossa plataforma de gestão de qualidade e marketplace B2B.
              </p>
              <p>
                Ao utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política. 
                Os termos utilizados nesta Política de Privacidade têm os mesmos significados que em nossos Termos de Uso.
              </p>
            </div>
          </div>

          {/* Informações Coletadas */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Informações que Coletamos</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Informações Pessoais</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Nome completo, e-mail, telefone e cargo</li>
                  <li>• Informações da empresa (CNPJ, razão social, endereço)</li>
                  <li>• Documentos de identificação e certificações</li>
                  <li>• Informações de pagamento e faturamento</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Informações de Uso</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dados de navegação e interação com a plataforma</li>
                  <li>• Logs de acesso, endereço IP e informações do dispositivo</li>
                  <li>• Preferências e configurações do usuário</li>
                  <li>• Histórico de transações e comunicações</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Informações de Terceiros</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dados obtidos de órgãos públicos para validação</li>
                  <li>• Informações de parceiros comerciais autorizados</li>
                  <li>• Dados de redes sociais (quando autorizado)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Como Usamos */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Como Usamos suas Informações</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Prestação de Serviços</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Criar e gerenciar sua conta</li>
                  <li>• Processar transações e pagamentos</li>
                  <li>• Validar documentos e certificações</li>
                  <li>• Facilitar conexões no marketplace</li>
                  <li>• Fornecer suporte técnico</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Melhorias e Comunicação</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Personalizar sua experiência</li>
                  <li>• Enviar notificações importantes</li>
                  <li>• Realizar pesquisas de satisfação</li>
                  <li>• Desenvolver novos recursos</li>
                  <li>• Cumprir obrigações legais</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compartilhamento */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Compartilhamento de Informações</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg mb-6">
              <p className="text-gray-700 font-medium mb-2">
                <strong>Importante:</strong> Não vendemos, alugamos ou comercializamos suas informações pessoais.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compartilhamos informações apenas quando:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Com seu consentimento explícito</strong> - Para facilitar conexões no marketplace</li>
                  <li>• <strong>Prestadores de serviços</strong> - Parceiros que nos ajudam a operar a plataforma</li>
                  <li>• <strong>Obrigações legais</strong> - Quando exigido por lei ou autoridades competentes</li>
                  <li>• <strong>Proteção de direitos</strong> - Para proteger nossos direitos, propriedade ou segurança</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Segurança dos Dados</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Medidas Técnicas</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Criptografia SSL/TLS em todas as comunicações</li>
                  <li>• Armazenamento seguro em nuvem (Firebase/Google Cloud)</li>
                  <li>• Autenticação multifator disponível</li>
                  <li>• Monitoramento contínuo de segurança</li>
                  <li>• Backups regulares e seguros</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Medidas Organizacionais</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Acesso restrito por função e necessidade</li>
                  <li>• Treinamento regular da equipe</li>
                  <li>• Políticas internas de segurança</li>
                  <li>• Auditorias periódicas de segurança</li>
                  <li>• Plano de resposta a incidentes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seus Direitos */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">6. Seus Direitos (LGPD)</h2>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Confirmação</strong> - Saber se tratamos seus dados</li>
                  <li>• <strong>Acesso</strong> - Obter cópia dos seus dados</li>
                  <li>• <strong>Correção</strong> - Corrigir dados incompletos ou incorretos</li>
                  <li>• <strong>Anonimização</strong> - Tornar dados anônimos</li>
                </ul>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Bloqueio</strong> - Suspender o uso dos dados</li>
                  <li>• <strong>Eliminação</strong> - Excluir dados desnecessários</li>
                  <li>• <strong>Portabilidade</strong> - Transferir dados para outro fornecedor</li>
                  <li>• <strong>Revogação</strong> - Retirar consentimento a qualquer momento</li>
                </ul>
              </div>
              
              <div className="mt-4 p-4 bg-white rounded border">
                <p className="text-sm text-gray-600">
                  <strong>Para exercer seus direitos:</strong> Entre em contato conosco através do e-mail 
                  <a href="mailto:privacidade@regulamais.com" className="text-blue-600 hover:underline"> privacidade@regulamais.com</a> 
                  ou através do nosso sistema de atendimento.
                </p>
              </div>
            </div>
          </div>

          {/* Retenção */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-6 w-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">7. Retenção de Dados</h2>
            </div>
            
            <div className="prose prose-lg text-gray-700">
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades 
                descritas nesta política, salvo quando um período de retenção mais longo for exigido ou 
                permitido por lei.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Períodos de Retenção:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Dados de conta ativa:</strong> Durante a vigência do contrato</li>
                  <li>• <strong>Dados financeiros:</strong> 5 anos (conforme legislação fiscal)</li>
                  <li>• <strong>Logs de acesso:</strong> 6 meses</li>
                  <li>• <strong>Dados de marketing:</strong> Até a revogação do consentimento</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Cookies e Tecnologias Similares</h2>
            </div>
            
            <div className="prose prose-lg text-gray-700">
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, personalizar conteúdo 
                e analisar o uso da plataforma. Você pode gerenciar suas preferências de cookies através das 
                configurações do seu navegador.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Essenciais</h4>
                  <p className="text-sm text-gray-600">Necessários para o funcionamento básico da plataforma</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Funcionais</h4>
                  <p className="text-sm text-gray-600">Melhoram a funcionalidade e personalização</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Analíticos</h4>
                  <p className="text-sm text-gray-600">Ajudam a entender como você usa a plataforma</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alterações */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">9. Alterações nesta Política</h2>
            </div>
            
            <div className="prose prose-lg text-gray-700">
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre mudanças 
                significativas através de e-mail ou aviso em nossa plataforma. Recomendamos revisar esta 
                política regularmente.
              </p>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Entre em Contato</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, 
              entre em contato conosco:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dados para Contato:</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li><strong>E-mail:</strong> privacidade@regulamais.com</li>
                  <li><strong>Telefone:</strong> (11) 9999-9999</li>
                  <li><strong>Endereço:</strong> São Paulo, SP</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Encarregado de Dados (DPO):</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li><strong>Nome:</strong> [Nome do DPO]</li>
                  <li><strong>E-mail:</strong> dpo@regulamais.com</li>
                  <li><strong>Responsabilidade:</strong> Supervisionar o cumprimento da LGPD</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PoliticaPrivacidadePage;

