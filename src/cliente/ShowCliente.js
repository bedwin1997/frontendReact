import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const URI = 'http://localhost:3100/api/v1/clients';

const CompShowClientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        getClientes();
    }, []);

    // Procedimiento para mostrar todos los clientes
    const getClientes = async () => {
        try {
            const res = await axios.get(URI);
            console.log('Datos recibidos:', res.data); // Verifica los datos
            if (Array.isArray(res.data.data)) {
                setClientes(res.data.data);
            } else {
                console.error('Datos no son un array:', res.data.data);
            }
        } catch (error) {
            console.error('Error al recuperar los clientes:', error);
        }
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
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(clientes) && clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombreCliente}</td>
                                    <td>{cliente.tipoIdentificacion}</td>
                                    <td>{cliente.observaciones}</td>
                                    <td>
                                        <Link to={`/edit/${cliente.id}`} className="btn btn-info"><i className="fa-solid fa-pen-to-square"></i></Link>
                                        <button className="btn btn-danger" onClick={() => deleteCliente(cliente.id)}><i className="fa-solid fa-trash-can"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompShowClientes;
