// App.jsx o donde definas el enrutador
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InstalacionesPage from "./pages/InstalacionesPage";
import InstalacionDeletePage from "./pages/InstalacionDeletePage";
import InstalacionFormPage from "./pages/InstalacionFormPage";

import 'bootstrap/dist/css/bootstrap.min.css';
import HorariosPage from "./pages/HorariosPage.jsx";
import HorariosFormPage from "./pages/HorariosFormPage.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {
                index: true, // Esto indica que es la ruta por defecto para "/"
                element: <HomePage/>,
            },
            {
                path: "login",
                element: <LoginPage/>,
            },
            {
                path: "instalaciones",
                element: <InstalacionesPage/>,
            },
            {
                path: "instalacion/add",
                element: <InstalacionFormPage/>,
            },
            {
                path: "instalacion/edit/:_id",
                element: <InstalacionFormPage/>,
            },
            {
                path: "instalacion/del/:_id",
                element: <InstalacionDeletePage/>,
            },
            /*{
              path: "mis-reservas",
              element: <ReservasPage />,
            },*/
            {
                path: "horarios",
                element: <HorariosPage/>,
            },
            {
                path: "horario/add",
                element: <HorariosFormPage/>,
            },
            {
                path: "horario/edit/:_id",
                element: <HorariosFormPage/>,
            },
            {
                path: "horario/delete/:_id",
                element: <HorariosFormPage/>,
            }
        ],
    },
]);

const App = () => {
    return <RouterProvider router={router}/>;
};

export default App;
