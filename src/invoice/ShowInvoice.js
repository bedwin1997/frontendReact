import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const URI = 'http://localhost:3100/api/v1/invoinces';

const CompShowInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [nombresClientes, setNombresClientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); 
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1); 

    // Nombre del cliente
    const fetchNombresClientes = async () => {
        try {
            const response = await axios.get("http://localhost:3100/api/v1/clients");
            setNombresClientes(response.data.data);
        } catch (error) {
            console.error('Error fetching nombre clientes:', error);
        }
    }

    // Nombre del cliente por ID
    const getNombreCliente = (id) => {
        const nombre = nombresClientes.find(nombre => nombre.id === id);
        return nombre ? nombre.nombreCliente : 'Desconocido';
    }

    // Procedimiento para mostrar todos los clientes
    const getInvoice = async (page = 1) => {
        try {
            const res = await axios.get(`${URI}?page=${page}&limit=${itemsPerPage}`);
            console.log('Datos recibidos:', res.data);
            if (Array.isArray(res.data.data)) {
                setInvoices(res.data.data);
                setTotalItems(res.data.pagination.totalItems);
                setTotalPages(res.data.pagination.totalPages);
            } else {
                console.error('Datos no son un array:', res.data.data);
            }
        } catch (error) {
            console.error('Error al recuperar las facturas:', error);
        }
    };

    useEffect(() => {
        getInvoice(currentPage);
        fetchNombresClientes();
    }, [currentPage]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Procedimiento para eliminar un cliente
    const deleteInvoice = async (id) => {
        try {
            await axios.delete(`${URI}/${id}`);
            getInvoice(); // Recargar clientes después de la eliminación
        } catch (error) {
            console.error('Error al eliminar factura:', error);
        }
    };

    //const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Link to="/createinvoice" className='btn btn-primary mt-2 mb-2'><i className="fa-solid fa-plus"></i></Link>
                    <table className="table table-striped-columns">
                        <thead className='table-primary'>
                            <tr>
                                <th>Id Cliente</th>
                                <th>Fecha</th>
                                <th>Nombre Producto</th>
                                <th>Precio</th>
                                <th>Valor Descuento</th>
                                <th>IVA</th>
                                <th>Valor Total</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(invoices) && invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{getNombreCliente(invoice.idCliente)}</td>
                                    <td>{invoice.fecha}</td>
                                    <td>{invoice.nombreProducto}</td>
                                    <td>{invoice.precio}</td>
                                    <td>{invoice.valorDescuento}</td>
                                    <td>{invoice.iva}</td>
                                    <td>{invoice.valorTotal}</td>
                                    <td>
                                        <Link to={`/editinvoice/${invoice.id}`} className="btn btn-info"><i className="fa-solid fa-pen-to-square"></i></Link>
                                        <button className="btn btn-danger" onClick={() => deleteInvoice(invoice.id)}><i className="fa-solid fa-trash-can"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompShowInvoice;
