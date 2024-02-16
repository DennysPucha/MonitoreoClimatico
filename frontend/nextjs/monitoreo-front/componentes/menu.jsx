export default function Menu() {
    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgba(1, 1, 1, 0.2)' }}>
            <div className="container-fluid">
                {/* Imagen al inicio del menú */}
                <div className="navbar-brand" href="../inicioSesion">
                    <img src="https://cdn-icons-png.flaticon.com/512/2383/2383684.png" alt="Inicio" height="50" />
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="../inicioSesion" style={{ color: 'white', fontSize: '20px' }}>
                                Cerrar sesión
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="../informes" style={{ color: 'white', fontSize: '20px' }}>
                                Historial
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="../sensores" style={{ color: 'white', fontSize: '20px' }}>
                                Sensores
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="../pronostico" style={{ color: 'white', fontSize: '20px' }}>
                                Pronostico
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Imagen al final del menú
                <a className="navbar-brand" href="/ruta/de/tu/imagen-fin.png">
                    <img src="https://cdn.icon-icons.com/icons2/1369/PNG/512/-account-circle_89831.png" alt="Fin" height="50" />
                </a> */}
            </div>
        </nav>
    );
}
