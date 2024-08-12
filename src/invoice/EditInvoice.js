import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Card, FloatingLabel } from 'react-bootstrap';

const URI = 'http://localhost:3100/api/v1/invoinces/';

const CompEditInvoice = () => {
    //Hook para los datos que interactuan con la iterfaz de usuario 
    const [idCliente, setIdCliente] = useState('');
    const [fecha, setFecha] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [precio, setPrecio] = useState('');
    const [valorDescuento, setValorDescuento] = useState('0'); // Valor por defecto del descuento
    const [iva, setIva] = useState(19); // Valor predeterminado del IVA
    const [valorTotal, setValorTotal] = useState('');
    const [nombresClientes, setNombresClientes] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    // Obtiene el nombre de clientes
    const fetchNombresClientes = async () => {
        try {
            const response = await axios.get('http://localhost:3100/api/v1/clients');
            setNombresClientes(response.data.data);
        } catch (error) {
            console.error('Error fetching nombre cliente:', error);
        }
    };

    // Calcula el valor total de la factura
    const calculateTotal = () => {
        const precioNumber = parseFloat(precio) || 0;
        const descuentoNumber = parseFloat(valorDescuento) || 0;
        const ivaNumber = parseFloat(iva) || 19;

        // Calcula el descuento
        const descuento = (precioNumber * descuentoNumber) / 100;
        const precioDescuento = precioNumber - descuento;

        // Calcula el IVA
        const ivaAmount = (precioDescuento * ivaNumber) / 100;
        const total = precioDescuento + ivaAmount;

        setValorTotal(total.toFixed(2));
    };

    //Permite generar el calculo del total de la factura teniendo encuenta el precio, valor de descuento y el IVA
    useEffect(() => {
        calculateTotal();
    }, [precio, valorDescuento, iva]);

    // Procedimiento para actualizar
    const update = async (e) => {
        e.preventDefault();
        await axios.put(URI + id, {
            idCliente,
            fecha,
            nombreProducto,
            precio,
            valorDescuento,
            iva,
            valorTotal
        });
        navigate('/invoice');
    };

    //Obtiene el id y el nombre del cliente al momento de editar
    useEffect(() => {
        getInvoiceById();
        fetchNombresClientes();
    }, []);

//Funcion asincronica que obtiene los datos que corresponden a el detalle de la factura     
    const getInvoiceById = async () => {
        const res = await axios.get(URI + id);
        const invoiceData = res.data.data;

        // Formatea la fecha al formato YYYY-MM-DDTHH:MM
        const fechaFormateada = new Date(invoiceData.fecha).toISOString().slice(0, 16);

        setIdCliente(invoiceData.idCliente);
        setFecha(fechaFormateada);
        setNombreProducto(invoiceData.nombreProducto);
        setPrecio(invoiceData.precio);
        setValorDescuento(invoiceData.valorDescuento);
        setIva(invoiceData.iva);
        setValorTotal(invoiceData.valorTotal);
    };

    return (
        <Card style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#000', textAlign: 'center', marginBottom: '20px' }}>Editar Factura</h3>
            <Form onSubmit={update}>
                <Form.Group>
                    <Card.Header className="bg-light text-dark text-center mb-3" style={{ borderRadius: '10px' }}>
                        Rellena la siguiente información
                    </Card.Header>
                </Form.Group>
                <Row className="mb-3">
                    <Col md={6}>
                        <FloatingLabel controlId="idCliente" label="Cliente">
                            <Form.Control 
                                as="select" 
                                value={idCliente} 
                                onChange={(e) => setIdCliente(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            >
                                <option value="">Selecciona</option>
                                {nombresClientes.map((nombre) => (
                                    <option key={nombre.id} value={nombre.id}>
                                        {nombre.nombreCliente}
                                    </option>
                                ))}
                            </Form.Control>
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel controlId="fecha" label="Fecha">
                            <Form.Control 
                                type="datetime-local" 
                                value={fecha} 
                                onChange={(e) => setFecha(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <FloatingLabel controlId="nombreProducto" label="Nombre del producto">
                            <Form.Control 
                                type="text" 
                                placeholder="Escribe nombre del producto"
                                value={nombreProducto} 
                                onChange={(e) => setNombreProducto(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel controlId="precio" label="Precio">
                            <Form.Control 
                                type="number" 
                                placeholder="Escribe precio"
                                value={precio} 
                                onChange={(e) => setPrecio(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <FloatingLabel controlId="valorDescuento" label="Valor de descuento">
                            <Form.Control 
                                as="select" 
                                value={valorDescuento} 
                                onChange={(e) => setValorDescuento(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            >
                                <option value="0">0%</option>
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                                <option value="50">50%</option>
                            </Form.Control>
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel controlId="iva" label="IVA">
                            <Form.Control 
                                type="text" 
                                value={`${iva}%`} 
                                readOnly
                                style={{ borderRadius: '10px' }}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={12}>
                        <FloatingLabel controlId="valorTotal" label="Valor Total">
                            <Form.Control 
                                type="text" 
                                value={valorTotal}
                                readOnly
                                style={{ borderRadius: '10px' }}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Button 
                    type="submit" 
                    style={{
                        backgroundColor: '#7879F1',
                        borderColor: '#7879F1',
                        borderRadius: '20px',
                        padding: '10px 20px',
                        marginTop: '20px',
                        float: 'right'
                    }}
                >
                    Guardar factura
                </Button>
            </Form>
        </Card>
    );
}

export default CompEditInvoice;
