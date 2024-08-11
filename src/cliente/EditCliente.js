import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:3100/api/v1/clients/';

const CompEditClient = () => {
    const [nombreCliente, setNombreCliente] = useState('')
    const [tipoIdentificacion, setTipoIdentificacion] = useState('')
    const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
    const [observaciones, setObservaciones] = useState('')
    const navigate = useNavigate()
    const {id} = useParams()

    //Procedimiento para actualizar
    const update = async (e) => {
        e.preventDefault()
        await axios.put(URI + id, {
            nombreCliente: nombreCliente,
            tipoIdentificacion: tipoIdentificacion,
            numeroIdentificacion: numeroIdentificacion,
            observaciones: observaciones
        })
        navigate('/')
    }

    useEffect(() => {
        getClienteById();
    }, []);

    const getClienteById = async () => {
        const res = await axios.get(URI + id)
        setNombreCliente(res.data.data.nombreCliente)
        setTipoIdentificacion(res.data.data.tipoIdentificacion)
        setNumeroIdentificacion(res.data.data.numeroIdentificacion)
        setObservaciones(res.data.data.observaciones)
    }

    return (
        <div className='container'>
            <h1>Clientes</h1>
            <form onSubmit={update}>
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
                        {/* Add options for different identification types */}
                        <option value="1">DNI</option>
                        <option value="2">PASAPORTE</option>
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
    )
}

export default CompEditClient