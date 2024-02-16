import { estaSesion } from '@/hooks/SessionUtil';
import 'bootstrap/dist/css/bootstrap.css';

export const metadata = {
  title: 'Monitoreo Climático',
  description: 'Generado UNL',
};

export default function RootLayout({ children }) {
  const autenticado = estaSesion();

  return (
    <html lang="en" style={{
      height: '100%',
    }}>
      <body style={{
        margin: 0,
        height: '100%',
        backgroundImage: 'url("https://i.pinimg.com/originals/56/7a/dc/567adc99bf754e9cf82107e77d463d52.jpg")',
        backgroundSize: 'cover', // Ajuste de la propiedad backgroundSize
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Fondo blanco semitransparente
      }} className="bg-primary text-white">
        <section className="container-fluid flex-grow-1">
          {children}
        </section>
      </body>
    </html>
  );
}
