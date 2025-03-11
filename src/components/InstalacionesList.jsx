import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const InstalacionesList = () => {
    const [instalaciones, setInstalaciones] = useState([]);
    // const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => { 
        const peticion = async () => {
            try {
                const response = await api.get('/instalacion');
                const corregidoOid = response.data.map(item => {
                    return {
                        ...item,
                        _id: item._id.$oid
                    };
                });
                setInstalaciones(corregidoOid);
            } catch (err) {
                // setError('No se puede completar la operación');
                navigate('/login')
                console.log(err);
            }
        };
        peticion();
    }, []); // <-- Agrega el arreglo de dependencias vacío

    return (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>  
                        <th>Nombre</th> 
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {instalaciones.map((instalacion) => (
                        <tr key={instalacion._id}>
                            <td>{instalacion._id}</td>
                            <td>{instalacion.nombre}</td>
                            <td>
                                <Button as={Link} to={`/instalacion/edit/${instalacion._id}`} className="btn-success">
                                    Editar
                                </Button>
                            </td>                            
                            <td>
                                <Button as={Link} to={`/instalacion/del/${instalacion._id}`} className="btn-danger">
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/*error && <p style={{ color: 'red' }}>{error}</p>*/}
        </Container>
    );
};

export default InstalacionesList;