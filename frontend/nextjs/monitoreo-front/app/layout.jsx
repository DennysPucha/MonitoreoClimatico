"use client";
import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);


  return (
    <html lang="en" style={{ height: '100%' }}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        backgroundImage: 'url("https://img.freepik.com/fotos-premium/paisaje-oscuro-montanas-rio-primer-plano_677426-165.jpg")',
        backgroundSize: 'cover',
        fontFamily: 'Roboto, sans-serif' /* Aplica la fuente Roboto a todo el cuerpo */
      }} className="bg-primary text-white">
        <section className="container-fluid flex-grow-1">
          {children}
        </section>
      </body>
    </html>
  );
}