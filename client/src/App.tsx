import React from 'react';
import './App.css';
import TextEditor from './Components/TextEditor';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    // Configurando o roteamento usando o React Router
    <Router>
      <Switch>
          {/* Redireciona automaticamente para uma página de documentos com um ID UUID gerado */}
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        {/* Rota para visualização e edição de um documento com base no ID na URL */}
        <Route path="/documents/:id">
          <TextEditor />
        </Route>
        {/* Rota para a página de lista de documentos */}
        <Route path="/documents">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
