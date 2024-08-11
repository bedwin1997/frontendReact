import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const URI = 'http://localhost:3100/api/v1/clients';

const CompShowClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); 
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);


    // Tipo de identificación
    const fetchTiposIdentificacion = async () => {
        try {
            const response = await axios.get("http://localhost:3100/api/v1/documents");
            setTiposIdentificacion(response.data.data);
        } catch (error) {
            console.error('Error fetching tipos de identificación:', error);
        }
    };

    useEffect(() => {
        getClientes();
        fetchTiposIdentificacion();
    }, []);

    // Procedimiento para mostrar todos los clientes
    const getClientes = async (page = 1) => {
        try {
            const res = await axios.get(`${URI}?page=${page}&limit=${itemsPerPage}`);
            console.log('Datos recibidos:', res.data);
            if (Array.isArray(res.data.data)) {
                setClientes(res.data.data);
                setTotalItems(res.data.pagination.totalItems); // Asumiendo que tu API devuelve el total de registros
                setTotalPages(res.data.pagination.totalPages);
            } else {
                console.error('Datos no son un array:', res.data.data);
            }
        } catch (error) {
            console.error('Error al recuperar los clientes:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        getClientes(currentPage);
        fetchTiposIdentificacion();
    }, [currentPage]);


    // Nombre del tipo de identificación por ID
    const getTipoIdentificacionNombre = (id) => {
        const tipo = tiposIdentificacion.find(tipo => tipo.id === id);
        return tipo ? tipo.tipoDocumento : 'Desconocido';
    };

    // Procedimiento para eliminar un cliente
    const deleteCliente = async (id) => {
        try {
            await axios.delete(`${URI}/${id}`);
            getClientes(); // Recargar clientes después de la eliminación
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Link to="/create" className='btn btn-primary mt-2 mb-2'><i className="fa-solid fa-plus"></i></Link>
                    <table className="table table-striped-columns">
                        <thead className='table-primary'>
                            <tr>
                                <th>Nombre Cliente</th>
                                <th>Tipo Identificación</th>
                                <th>Numero Identificación</th>
                                <th>Observaciones</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(clientes) && clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombreCliente}</td>
                                    <td>{getTipoIdentificacionNombre(cliente.tipoIdentificacion)}</td>
                                    <td>{cliente.numeroIdentificacion}</td>
                                    <td>{cliente.observaciones}</td>
                                    <td>
                                        <Link to={`/edit/${cliente.id}`} className="btn btn-info"><i className="fa-solid fa-pen-to-square"></i></Link>
                                        <button className="btn btn-danger" onClick={() => deleteCliente(cliente.id)}><i className="fa-solid fa-trash-can"></i></button>
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

export default CompShowClientes;
