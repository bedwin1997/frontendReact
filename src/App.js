import logo from './logo.svg';
import './App.css';

//Importamos los componentes
import CompShowClientes from './cliente/ShowCliente';
import CompCreateCliente from './cliente/CreateCliente';
import CompEditClient from './cliente/EditCliente';

//Importamos el route
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompShowClientes />} />
          <Route path="/create" element={<CompCreateCliente />} />
          <Route path="/edit/:id" element={<CompEditClient />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
