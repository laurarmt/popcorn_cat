import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeaderMinimalist from "../components/HeaderMinimalist";
import '../styles/Privacity.css';

const Privacity = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="app">
      
      {!token ? <HeaderMinimalist /> : <Header />}
      <div className="legal-notice">
      <h2 className="legal-title">Aviso Legal y Política de Privacidad</h2>

      <h3 className="legal-section-title">1. Finalidad del tratamiento de los datos</h3>
      <p className="legal-paragraph">Los datos de carácter personal que se puedan recoger a través de nuestros formularios web se utilizan con el único fin de:</p>
      <ul className="legal-list">
        <li>Gestionar el registro de los usuarios.</li>
        <li>Envío de comunicaciones relacionadas directamente con el registro.</li>
        <li>Gestionar, administrar, supervisar su actividad en el reseñas y juego incorporado.</li>
        <li>Gestionar la participación de los usuarios en el portal de reseñas y juego incorporados.</li>
        <li>Realizar pruebas técnicas de funcionamiento y seguridad.</li>
        <li>Cumplir con las obligaciones legales que nos resulten directamente aplicables y regulen nuestra actividad.</li>
        <li>Para proteger y ejercer nuestros derechos o responder ante reclamaciones de cualquier índole.</li>
        <li>No se utilizarán los datos para fines comerciales ni se cederán a terceros.</li>
      </ul>

      <h3 className="legal-section-title">2. Base legal para el tratamiento</h3>
      <p className="legal-paragraph">
        La base legal para el tratamiento de sus datos es el consentimiento explícito del usuario, que se solicita mediante los formularios habilitados en esta aplicación.
      </p>

      <h3 className="legal-section-title">3. Derechos de los usuarios</h3>
      <p className="legal-paragraph">El usuario puede ejercer en cualquier momento los siguientes derechos:</p>
      <ul className="legal-list">
        <li>Acceso a sus datos personales mediante la aplicación.</li>
        <li>Rectificación de los datos inexactos, por medio de los formularios puestos en la aplicación.</li>
        <li>Supresión de sus datos, es decir, derecho al olvido.</li>
        <li>
          Limitación u oposición al tratamiento, es decir, los datos se podrán almacenar, pero no se utilizarán salvo para defensa legal, reclamaciones o con consentimiento.
          También el usuario tiene derecho a oponerse a que sus datos se utilicen para estadísticas, comerciales, marketing, etc.
        </li>
      </ul>

      <h3 className="legal-section-title">4. Seguridad de los datos</h3>
      <p className="legal-paragraph">
        Se han implementado medidas técnicas y organizativas para proteger los datos personales frente a pérdida, uso indebido, acceso no autorizado o alteración.
      </p>

      <h3 className="legal-section-title">5. Conservación de los datos</h3>
      <p className="legal-paragraph">
        Los datos se conservarán únicamente durante el tiempo necesario para las pruebas técnicas del sistema y presentación del proyecto. Posteriormente serán eliminados al finalizar el proyecto o cuando el usuario lo solicite.
      </p>

      <h3 className="legal-section-title">6. Cambios en esta política</h3>
      <p className="legal-paragraph">
        Esta política puede actualizarse para reflejar cambios legales o técnicos. La versión vigente estará siempre disponible en este apartado.
      </p>
    </div>
      <Footer />
    </div>
  );
};

export default Privacity;
