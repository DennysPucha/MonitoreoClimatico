import Link from "next/link";

export default function Menu() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'rgba(255, 255, 255, 0.0)' }}>
            <div className="container-fluid">
                {/* Imagen al inicio del menú */}
                <Link href="../inicioSesion" passHref>
                    <div className="navbar-brand">
                        <img src="https://cdn-icons-png.flaticon.com/512/2383/2383684.png" alt="Inicio" height="50" />
                    </div>
                </Link>

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
                            <Link href="../inicioSesion" passHref>
                                <div className="nav-link" style={{ color: 'white', fontSize: '20px' }}>Cerrar sesión</div>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="../informes" passHref>
                                <div className="nav-link" style={{ color: 'white', fontSize: '20px' }}>Historial</div>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="../sensores" passHref>
                                <div className="nav-link" style={{ color: 'white', fontSize: '20px' }}>Sensores</div>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="../pronostico" passHref>
                                <div className="nav-link" style={{ color: 'white', fontSize: '20px' }}>Pronóstico</div>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Imagen al final del menú */}
                <Link href="/ruta/de/tu/imagen-fin.png" passHref>
                    <div className="navbar-brand">
                        <img src="https://cdn.icon-icons.com/icons2/1369/PNG/512/-account-circle_89831.png" alt="Fin" height="50" />
                    </div>
                </Link>
            </div>
        </nav>
    );
}
