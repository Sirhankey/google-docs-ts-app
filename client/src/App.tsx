import React from 'react';
import './App.css';
import TextEditor from './Components/TextEditor';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        <Route path="/documents/:id">
          <TextEditor />
        </Route>
        <Route path="/documents">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
