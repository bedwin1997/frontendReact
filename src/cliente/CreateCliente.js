import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:3100/api/v1/clients';

const CompCreateCliente = () => {
    const [nombreCliente, setNombreCliente] = useState('');
    const [tipoIdentificacion, setTipoIdentificacion] = useState('');
    const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [tiposIdentificacion, setTiposIdentificacion] = useState([]); 
    const navigate = useNavigate();

    // Obtener tipos de identificación
    const fetchTiposIdentificacion = async () => {
        try {
            const response = await axios.get('http://localhost:3100/api/v1/documents');
            setTiposIdentificacion(response.data.data);
        } catch (error) {
            console.error('Error fetching tipos de identificación:', error);
        }
    };

    useEffect(() => {
        fetchTiposIdentificacion();
    }, []);

    // Procedimiento Guardar
    const store = async (e) => {
        e.preventDefault();
        try {
            await axios.post(URI, {
                nombreCliente,
                tipoIdentificacion,
                numeroIdentificacion,
                observaciones
            });
            navigate('/');
        } catch (error) {
            console.error('Error saving client:', error);
        }
    };

    return (
        <div className='container'>
            <h1>Clientes</h1>
            <form onSubmit={store}>
                <div className='form-group'>
                    <label htmlFor="nombreCliente">Nombre del cliente:</label>
                    <input
                        type="text"
                        className='form-control'
                        id="nombreCliente"
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor="tipoIdentificacion">Tipo de identificación:</label>
                    <select
                        className="form-control"
                        id="tipoIdentificacion"
                        value={tipoIdentificacion}
                        onChange={(e) => setTipoIdentificacion(e.target.value)}
                    >
                        <option value="">Selecciona</option>
                        {tiposIdentificacion.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.tipoDocumento}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="numeroIdentificacion">Número de identificación:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="numeroIdentificacion"
                        value={numeroIdentificacion}
                        onChange={(e) => setNumeroIdentificacion(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="observaciones">Observaciones:</label>
                    <textarea
                        className="form-control"
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar cliente
                </button>
            </form>
        </div>
    );
}

export default CompCreateCliente;
