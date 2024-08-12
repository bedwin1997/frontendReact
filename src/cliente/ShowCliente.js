import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Card } from 'react-bootstrap';

const URI = 'http://localhost:3100/api/v1/clients';

const CompShowClientes = () => {
    //Hook para los datos que interactuan con la iterfaz de usuario 
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

    //Carga los clientes y el tipo de documento al momento de ingresar en la vista
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

    //Funcion que permite utilizar paginación
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Alcambiar de pagina los datos se actualizaran y se listaran sin problema en la nueva pagina
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
        <Container style={{ marginTop: '20px' }}>
            <Card className="p-4" style={{ borderRadius: '15px', borderColor: '#f0f0f5' }}>
                <h5 className="mb-4" style={{ color: '#FFFFFF', textAlign: 'center', backgroundColor: '#000', padding: '10px', borderRadius: '10px' }}>Lista de Clientes</h5>
                <Row>
                    <Col className='text-end mb-3'>
                        <Link to="/create">
                            <Button 
                                style={{
                                    backgroundColor: '#7879F1',
                                    borderColor: '#7879F1',
                                    borderRadius: '20px',
                                    padding: '10px 20px'
                                }}>
                                <i className="fa-solid fa-plus"></i> Agregar Cliente
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped hover responsive>
                            <thead style={{ backgroundColor: '#EDEDF3', color: '#6B6B75' }}>
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
                                            <Link to={`/edit/${cliente.id}`} className="btn btn-info" style={{ marginRight: '5px' }}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                            <Button 
                                                className="btn btn-danger" 
                                                onClick={() => deleteCliente(cliente.id)}
                                                style={{ backgroundColor: '#FF5C5C', borderColor: '#FF5C5C' }}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-between">
                            <Button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                style={{
                                    backgroundColor: '#7879F1',
                                    borderColor: '#7879F1',
                                    borderRadius: '10px',
                                    padding: '5px 15px'
                                }}>
                                Anterior
                            </Button>
                            <span style={{ margin: 'auto 0', color: '#6B6B75' }}>
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                style={{
                                    backgroundColor: '#7879F1',
                                    borderColor: '#7879F1',
                                    borderRadius: '10px',
                                    padding: '5px 15px'
                                }}>
                                Siguiente
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default CompShowClientes;
