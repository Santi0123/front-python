import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Container, Form, Table} from "react-bootstrap";
import api from "../services/api.js";

const HorariosList = () => {
    const [horarios, setHorarios] = useState([]);
    const [instalaciones, setInstalaciones] = useState([]);
    const [selectedInstalacion, setSelectedInstalacion] = useState("");
    const navigate = useNavigate();

    // Obtener instalaciones
    useEffect(() => {
        const fetchInstalaciones = async () => {
            try {
                const response = await api.get('/instalacion');
                const fixOid = response.data.map(item => ({
                    ...item,
                    _id: item._id.$oid
                }));
                setInstalaciones(fixOid);
            } catch (error) {
                console.error("Error fetching instalaciones:", error);
            }
        };
        fetchInstalaciones();
    }, []);

    // Obtener horarios con estructura anidada
    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const response = await api.get('/horario');
                const fixOid = response.data.map(item => ({
                    ...item,
                    _id: item._id.$oid,
                    instalacion: {
                        _id: item.instalacion._id.$oid,
                        nombre: item.instalacion.nombre
                    }
                }));
                setHorarios(fixOid);
            } catch (error) {
                navigate("/login");
                console.error(error);
            }
        };
        fetchHorarios();
    }, [navigate]);

    // Filtrar horarios
    const filteredHorarios = selectedInstalacion
        ? horarios.filter(h => h.instalacion._id === selectedInstalacion)
        : horarios;

    return (
        <Container>
            <Form.Group className="mb-4">
                <Form.Label>Filtrar por instalación:</Form.Label>
                <Form.Select
                    value={selectedInstalacion}
                    onChange={(e) => setSelectedInstalacion(e.target.value)}
                >
                    <option value="">Todas las instalaciones</option>
                    {instalaciones.map(instalacion => (
                        <option key={instalacion._id} value={instalacion._id}>
                            {instalacion.nombre}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Instalación</th>
                    <th>Hora Inicio</th>
                    <th>Hora Fin</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {filteredHorarios.map(horario => (
                    <tr key={horario._id}>
                        <td>{horario._id}</td>
                        <td>{horario.instalacion.nombre}</td>
                        <td>{horario.hora_inicio.toString()}</td>
                        <td>{horario.hora_fin.toString()}</td>
                        <td>
                            <Button
                                as={Link}
                                to={`/horario/edit/${horario._id}`}
                                variant="warning"
                                size="sm"
                                className="me-2"
                            >
                                Editar
                            </Button>
                            <Button
                                as={Link}
                                to={`/horario/delete/${horario._id}`}
                                variant="danger"
                                size="sm"
                            >
                                Eliminar
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default HorariosList;