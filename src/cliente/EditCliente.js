import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, FloatingLabel } from 'react-bootstrap';

const URI = 'http://localhost:3100/api/v1/clients/';

const CompEditClient = () => {
    const [nombreCliente, setNombreCliente] = useState('');
    const [tipoIdentificacion, setTipoIdentificacion] = useState('');
    const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    // Obtener tipos de identificación
    const fetchTiposIdentificacion = async () => {
        try {
            const response = await axios.get('http://localhost:3100/api/v1/documents');
            setTiposIdentificacion(response.data.data);
        } catch (error) {
            console.error('Error fetching tipos de identificación:', error);
        }
    };

    // Procedimiento para actualizar
    const update = async (e) => {
        e.preventDefault();
        try {
            await axios.put(URI + id, {
                nombreCliente,
                tipoIdentificacion,
                numeroIdentificacion,
                observaciones
            });
            navigate('/');
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    useEffect(() => {
        getClienteById();
        fetchTiposIdentificacion();
    }, []);

    const getClienteById = async () => {
        try {
            const res = await axios.get(URI + id);
            const clienteData = res.data.data;
            setNombreCliente(clienteData.nombreCliente);
            setTipoIdentificacion(clienteData.tipoIdentificacion);
            setNumeroIdentificacion(clienteData.numeroIdentificacion);
            setObservaciones(clienteData.observaciones);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Card className="p-4" style={{ maxWidth: '600px', margin: '0 auto', borderRadius: '15px', borderColor: '#f0f0f5' }}>
                <h2 className="mb-4" style={{ color: '#3E3E4F', textAlign: 'left' }}>Editar Cliente</h2>
                <Form onSubmit={update}>
                    <Card className="mb-4" style={{ border: 'none', backgroundColor: '#fafafb' }}>
                        <Card.Body>
                            <Card.Title className="text-muted" style={{ borderBottom: '2px solid #EDEDF3', paddingBottom: '10px', textAlign: 'left' }}>
                                Edita la siguiente información
                            </Card.Title>
                            <Row>
                                <Col md={12}>
                                    <FloatingLabel controlId="nombreCliente" label="Nombre del cliente" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el nombre del cliente"
                                            value={nombreCliente}
                                            onChange={(e) => setNombreCliente(e.target.value)}
                                            style={{ borderColor: '#EDEDF3', borderRadius: '10px' }}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={6}>
                                    <FloatingLabel controlId="tipoIdentificacion" label="Tipo de identificación" className="mb-3">
                                        <Form.Control
                                            as="select"
                                            value={tipoIdentificacion}
                                            onChange={(e) => setTipoIdentificacion(e.target.value)}
                                            style={{ borderColor: '#EDEDF3', borderRadius: '10px' }}
                                        >
                                            <option value="">Selecciona</option>
                                            {tiposIdentificacion.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.tipoDocumento}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </FloatingLabel>
                                </Col>
                                <Col md={6}>
                                    <FloatingLabel controlId="numeroIdentificacion" label="Número de identificación" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe número identificación"
                                            value={numeroIdentificacion}
                                            onChange={(e) => setNumeroIdentificacion(e.target.value)}
                                            style={{ borderColor: '#EDEDF3', borderRadius: '10px' }}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={12}>
                                    <FloatingLabel controlId="observaciones" label="Observaciones" className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Escribe observaciones"
                                            rows={3}
                                            value={observaciones}
                                            onChange={(e) => setObservaciones(e.target.value)}
                                            style={{ borderColor: '#EDEDF3', borderRadius: '10px' }}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <div className="d-flex justify-content-end">
                        <Button
                            variant="primary"
                            type="submit"
                            style={{
                                backgroundColor: '#7879F1',
                                borderColor: '#7879F1',
                                borderRadius: '20px',
                                padding: '10px 30px'
                            }}
                        >
                            Guardar cliente
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default CompEditClient;
