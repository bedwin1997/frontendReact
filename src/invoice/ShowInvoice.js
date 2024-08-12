import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Card } from 'react-bootstrap';

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

    // Procedimiento para mostrar todas las facturas
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

    // Procedimiento para eliminar una factura
    const deleteInvoice = async (id) => {
        try {
            await axios.delete(`${URI}/${id}`);
            getInvoice(); // Recargar facturas después de la eliminación
        } catch (error) {
            console.error('Error al eliminar factura:', error);
        }
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Card className="p-4" style={{ borderRadius: '15px', borderColor: '#f0f0f5' }}>
                <h2 className="mb-4" style={{ color: '#FFFFFF', textAlign: 'center', backgroundColor: '#000', padding: '10px', borderRadius: '10px' }}>Lista de Facturas</h2>
                <Row>
                    <Col className='text-end mb-3'>
                        <Link to="/createinvoice">
                            <Button 
                                style={{
                                    backgroundColor: '#7879F1',
                                    borderColor: '#7879F1',
                                    borderRadius: '20px',
                                    padding: '10px 20px'
                                }}>
                                <i className="fa-solid fa-plus"></i> Agregar Factura
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped hover responsive>
                            <thead style={{ backgroundColor: '#EDEDF3', color: '#6B6B75' }}>
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
                                            <Link to={`/editinvoice/${invoice.id}`} className="btn btn-info" style={{ marginRight: '5px' }}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                            <Button 
                                                className="btn btn-danger" 
                                                onClick={() => deleteInvoice(invoice.id)}
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

export default CompShowInvoice;
