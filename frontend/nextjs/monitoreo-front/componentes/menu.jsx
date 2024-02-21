import Link from "next/link";

export default function Menu() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'rgba(255, 255, 255, 0.0)' }}>
            <div className="container-fluid">
                <Link href="../sensores" passHref>
                    <div className="navbar-brand">
                        <img src="https://i.pinimg.com/564x/eb/82/a0/eb82a0d0be0575ab76c74579fc2ee6c9.jpg" alt="Inicio" height="50" style={{ borderRadius: '50%' }} />
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
                            <a className="nav-link" href="../principal" style={{ color: 'white', fontSize: '20px' }}>
                                Cerrar sesión
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="../sensores" style={{ color: 'white', fontSize: '20px' }}>
                                Sensores
                            </a>
                        </li>
                    </ul>
                </div>
                {/* 
                <a className="navbar-brand" href="/ruta/de/tu/imagen-fin.png">
                    <img src="https://cdn.icon-icons.com/icons2/1369/PNG/512/-account-circle_89831.png" alt="Fin" height="50" />
                </a> */}
            </div>
        </nav>
    );
}