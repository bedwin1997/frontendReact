import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CompShowClientes from './cliente/ShowCliente';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompShowClientes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
