import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../services/api.js";
import {Button, Form} from "react-bootstrap";

const HorariosForm = () => {

        const {_id} = useParams();
        const navigate = useNavigate();
        const location = useLocation();

        const [horaFin, setHoraFin] = useState("");
        const [horaInicio, setHoraInicio] = useState("");
        const [instalaciones, setInstalaciones] = useState([]);
        const [selectedInstalacion, setSelectedInstalacion] = useState("");
        const [error, setError] = useState("");

        // Convertir formato de hora ISO a HH:MM
        const isoToTime = (isoString) => {
            const date = new Date(isoString);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        };

        // Convertir HH:MM a DateTime ISO
        const timeToISO = (time) => {
            const [hours, minutes] = time.split(':');
            return new Date(1970, 0, 1, hours, minutes).toISOString();
        };

        const getActionType = () => {
            const path = location.pathname;
            if (path.includes("add")) return "add";
            if (path.includes("edit")) return "edit";
            if (path.includes("delete")) return "delete";
        };

        useEffect(() => {
            const fetchData = async () => {
                try {
                    // Cargar instalaciones
                    const instResponse = await api.get('/instalacion');
                    const fixedInstalaciones = instResponse.data.map(item => ({
                        _id: item._id.$oid,
                        nombre: item.nombre
                    }));
                    setInstalaciones(fixedInstalaciones);

                    // Cargar datos del horario si es edición/eliminación
                    if (_id) {
                        // Cargar datos del horario
                        const response = await api.get(`/horario/${_id}`);
                        const data = response.data;

                        // Formatear fechas
                        setHoraInicio(isoToTime(data.hora_inicio));
                        setHoraFin(isoToTime(data.hora_fin));

                        // Establecer instalación seleccionada
                        if (data.instalacion && data.instalacion._id) {
                            setSelectedInstalacion(data.instalacion._id.$oid);
                        }
                    }

                } catch (error) {
                    setError("Error cargando datos");
                    console.error("Error en fetchData:", error);
                }
            };

            fetchData();
        }, [_id]);


        const handleSubmit = async (event) => {
            event.preventDefault();
            setError("");

            if (!horaInicio || !horaFin || !selectedInstalacion) {
                setError("Todos los campos son requeridos");
                return;
            }

            // Buscar la instalación seleccionada
            const instalacionSeleccionada = instalaciones.find(
                inst => inst._id === selectedInstalacion
            );

            if (!instalacionSeleccionada) {
                setError("Instalación no válida");
                return;
            }

            const horarioData = {
                hora_fin: timeToISO(horaFin),
                hora_inicio: timeToISO(horaInicio),
                instalacion: instalacionSeleccionada
            }

            /*const horarioData = {
                hora_inicio: timeToISO(horaInicio),
                hora_fin: timeToISO(horaFin),
                instalacion: {
                    _id: instalacionSeleccionada._id,
                    id: instalacionSeleccionada.id,
                    nombre: instalacionSeleccionada.nombre
                }
            };*/

            try {
                const action = getActionType();
                if (action === "add") {
                    await api.post("/horario", horarioData);
                } else if (action === "edit") {
                    await api.put('/horario/' + _id, horarioData);
                }
                navigate("/horarios");
            } catch (error) {
                setError(error.response?.data?.error || "Error guardando datos");
                console.error("Error en submit:", error);
            }
        };

        const handleDelete = async (event) => {
            event.preventDefault();
            try {
                await api.delete(`/horario/${_id}`, {_id});
                navigate("/horarios");
            } catch (error) {
                setError("Error eliminando horario");
                console.error("Error en delete:", error);
            }
        };

        return (
            <Form className="p-4 border rounded-3 bg-light">
                <h3 className="mb-4">
                    {getActionType() === "add" && "Nuevo Horario"}
                    {getActionType() === "edit" && "Editar Horario"}
                    {getActionType() === "delete" && "Eliminar Horario"}
                </h3>

                <Form.Group className="mb-3">
                    <Form.Label>Instalación</Form.Label>
                    <Form.Select
                        value={selectedInstalacion}
                        onChange={(e) => setSelectedInstalacion(e.target.value)}
                        disabled={getActionType() === "edit" || getActionType() === "delete"}
                        required
                    >
                        <option value="">Seleccionar instalación</option>
                        {instalaciones.map(inst => (
                            <option
                                key={inst._id}
                                value={inst._id}>
                                {inst.nombre}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Hora Inicio</Form.Label>
                    <Form.Control
                        type="time"
                        //step="300"  // Intervalos de 5 minutos
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        disabled={getActionType() === "delete"}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Hora Fin</Form.Label>
                    <Form.Control
                        type="time"
                        //step="300"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        disabled={getActionType() === "delete"}
                        required
                    />
                </Form.Group>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-flex gap-2">
                    <Button
                        variant={getActionType() === "delete" ? "danger" : "primary"}
                        onClick={getActionType() === "delete" ? handleDelete : handleSubmit}
                    >
                        {getActionType() === "add" && "Crear"}
                        {getActionType() === "edit" && "Actualizar"}
                        {getActionType() === "delete" && "Confirmar Eliminación"}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => navigate("/horarios")}
                    >
                        Cancelar
                    </Button>
                </div>
            </Form>
        );
    }
;

export default HorariosForm;