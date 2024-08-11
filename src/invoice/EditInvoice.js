import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:3100/api/v1/invoinces/';

const CompEditInvoice = () => {
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

    // Obtener nombre de clientes
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

    useEffect(() => {
        calculateTotal();
    }, [precio, valorDescuento, iva]);

    // Procedimiento para actualizar
    const update = async (e) => {
        e.preventDefault();
        await axios.put(URI + id, {
            idCliente: idCliente,
            fecha: fecha,
            nombreProducto: nombreProducto,
            precio: precio,
            valorDescuento: valorDescuento,
            iva: iva,
            valorTotal: valorTotal
        });
        navigate('/invoice');
    };

    useEffect(() => {
        getInvoiceById();
        fetchNombresClientes();
    }, []);

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
        <div className='container'>
            <h1>Editar Factura</h1>
            <form onSubmit={update}>
                <div className='form-group'>
                    <label htmlFor="idCliente">Cliente:</label>
                    <select
                        className="form-control"
                        id="idCliente"
                        value={idCliente}
                        onChange={(e) => setIdCliente(e.target.value)}
                    >
                        <option value="">Selecciona</option>
                        {nombresClientes.map((nombre) => (
                            <option key={nombre.id} value={nombre.id}>
                                {nombre.nombreCliente}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                        type="datetime-local"
                        className='form-control'
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nombreProducto">Nombre Producto:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombreProducto"
                        value={nombreProducto}
                        onChange={(e) => setNombreProducto(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="precio">Precio:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="valorDescuento">Valor Descuento:</label>
                    <select
                        className="form-control"
                        id="valorDescuento"
                        value={valorDescuento}
                        onChange={(e) => setValorDescuento(e.target.value)}
                    >
                        <option value="0">0%</option>
                        <option value="10">10%</option>
                        <option value="20">20%</option>
                        <option value="30">30%</option>
                        <option value="50">50%</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="iva">IVA:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="iva"
                        value={iva}
                        onChange={(e) => setIva(e.target.value)}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="valorTotal">Valor Total:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="valorTotal"
                        value={valorTotal}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar cliente
                </button>
            </form>
        </div>
    );
};

export default CompEditInvoice;
