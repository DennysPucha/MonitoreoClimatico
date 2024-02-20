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
        backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/028/663/748/non_2x/ai-ai-generatedrealistic-4k-sky-with-serene-cumulus-clouds-nature-s-atmospheric-beauty-in-stunning-detail-ideal-for-calming-and-scenic-concepts-free-photo.jpeg")', 
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
