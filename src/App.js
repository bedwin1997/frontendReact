import logo from './logo.svg';
import './App.css';

//Importamos los componentes
import CompShowClientes from './cliente/ShowCliente';
import CompCreateCliente from './cliente/CreateCliente';
import CompEditClient from './cliente/EditCliente';
import CompShowInvoice from './invoice/ShowInvoice';
import CompCreateInvoice from './invoice/CreateInvoice';
import CompEditInvoice from './invoice/EditInvoice';

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
          <Route path="/invoice" element={<CompShowInvoice />} />
          <Route path="/createinvoice" element={<CompCreateInvoice />} />
          <Route path="/editinvoice/:id" element={<CompEditInvoice />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
