import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api"

const InstalacionForm = () =>{

    let { _id } = useParams();

    // const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const ruta = useLocation();

    const estado = () => {
        if (ruta.pathname.includes('add')) return 'add';
        if (ruta.pathname.includes('del')) return 'del';
        if (ruta.pathname.includes('edit')) return 'edit';
    }

    const manejaForm = async(event) => {
        event.preventDefault();
        try {
            const response = await api.post('/instalacion', { _id, nombre });
            /*
            setId(response.data._id);
            setNombre(response.data.nombre);
            */
            console.log(response);
            navigate('/instalaciones')
        } catch (err) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    }

    const deleteForm = async(event) => {
        event.preventDefault();
        try {
            const response = await api.delete('/instalacion/'+ _id, { _id, nombre });
            /*
            setId(response.data._id);
            setNombre(response.data.nombre);
            */
            console.log(response);
            navigate('/instalaciones')
        } catch (err) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    }

    const manejaAtras = async(event) => {
        event.preventDefault();
        navigate(-1);
    }

    useEffect( ()=>{
        const peticion = async () => {
            console.log("---===================-----")
            console.log(_id)
            //if (!isNaN(_id))
                try {
                    const response = await api.get('/instalacion/'+_id);
                    console.log(response);
                    setNombre(response.data.nombre);                    
                } catch (err) {
                    setError('No se puede completar la operación');
                    // navigate('/login')
                    console.log(err);
                }
        };
        peticion();
        
    }, []);

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>ID:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ID de Instalación"
                    aria-label="Identificador de la instalación"                    
                    disabled
                    value={_id}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nombre de Instalación"
                    aria-label="Nombre de la instalación"
                    value={nombre}
                    disabled={estado()=='del'?true:false}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                {
                    {
                        'add': <Button className="btn-success" onClick={manejaForm}>Alta</Button>,
                        'edit': <Button className="btn-success" onClick={manejaForm}>Actualizar</Button>,
                        'del': <Button as={Link} className="btn-danger" onClick={deleteForm} >Borrar</Button>
                    } [estado()]
                }
                <Button as={Link} onClick={manejaAtras} >
                    Cancelar
                </Button>
            </Form.Group>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
    );


}



export default InstalacionForm;