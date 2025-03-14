import HorariosList from "../components/HorariosList.jsx";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const HorariosPage = () => {

    return (

        <>
            <h3>Listado de horarios</h3>
            <Button as={Link} to="/horario/add">Agregar nuevo horario</Button>
            <HorariosList/>
        </>
    )
}

export default HorariosPage;