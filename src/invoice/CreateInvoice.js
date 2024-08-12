import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, FloatingLabel } from 'react-bootstrap';

const URI = 'http://localhost:3100/api/v1/invoinces';

const CompCreateInvoice = () => {
    //Hook para los datos que interactuan con la iterfaz de usuario 
    const [idCliente, setIdCliente] = useState('');
    const [fecha, setFecha] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [precio, setPrecio] = useState('');
    const [valorDescuento, setValorDescuento] = useState('0');
    const [iva, setIva] = useState(19);
    const [valorTotal, setValorTotal] = useState('');
    const [nombresClientes, setNombresClientes] = useState([]);
    const navigate = useNavigate();

    // Obtiene el nombre de clientes
    const fetchNombresClientes = async () => {
        try {
            const response = await axios.get('http://localhost:3100/api/v1/clients');
            setNombresClientes(response.data.data);
        } catch (error) {
            console.error('Error fetching nombres de clientes:', error);
        }
    };

    //Obtiene los nombres de los clientes
    useEffect(() => {
        fetchNombresClientes();
    }, []);

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

    // Procedimiento para guardar
    const store = async (e) => {
        e.preventDefault();
        try {
            await axios.post(URI, {
                idCliente,
                fecha,
                nombreProducto,
                precio,
                valorDescuento,
                iva,
                valorTotal
            });
            navigate('/invoice');
        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    return (
        <Card style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#000', textAlign: 'center', marginBottom: '20px' }}>Facturas</h3>
            <Form onSubmit={store}>
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
                                <option value="">Selecciona cliente</option>
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
                                type="date" 
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
                                placeholder="Escribe nombre de producto"
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
                <Form.Group className="mt-3">
                    <Form.Label>Valor total de la factura:</Form.Label>
                    <h4>${valorTotal}</h4>
                </Form.Group>
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
                    Enviar factura
                </Button>
            </Form>
        </Card>
    );
}

export default CompCreateInvoice;
