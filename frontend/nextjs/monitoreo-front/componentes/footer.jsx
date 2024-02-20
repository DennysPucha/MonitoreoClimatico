import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.footerContent}>
                <div>
                    <h3 style={styles.logo}>Mi Sitio Web</h3>
                    <p style={styles.copyRight}>© 2024 Mi Empresa. Todos los derechos reservados.</p>
                </div>
                <div>
                    <h4 style={styles.footerHeading}>Enlaces</h4>
                    <ul style={styles.footerLinks}>
                        <li><a href="#">Acerca de nosotros</a></li>
                        <li><a href="#">Contacto</a></li>
                        <li><a href="#">Política de privacidad</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px 0',
    },
    footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    logo: {
        fontSize: '24px',
        margin: '0',
    },
    copyRight: {
        fontSize: '14px',
    },
    footerHeading: {
        fontSize: '18px',
    },
    footerLinks: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
    },
};

export default Footer;
