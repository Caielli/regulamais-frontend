import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe os componentes do site comercial
import MarketingLayout from './components/marketing/MarketingLayout';
import MarketingHomePage from './components/marketing/MarketingHomePage';
import PoliticaPrivacidadePage from './components/marketing/PoliticaPrivacidadePage';
import TermosDeUsoPage from './components/marketing/TermosDeUsoPage';

// Importe o seu aplicativo de gestão
import WebApp from './WebApp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas do Site Comercial */}
        <Route path="/" element={<MarketingLayout />}>
          <Route index element={<MarketingHomePage />} />
          <Route path="politica-privacidade" element={<PoliticaPrivacidadePage />} />
          <Route path="termos-de-uso" element={<TermosDeUsoPage />} />
        </Route>

        {/* Rota para o Aplicativo de Gestão */}
        <Route path="/app/*" element={<WebApp />} />

        {/* Catch-all para rotas não encontradas */}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-gray-600">404 - Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

