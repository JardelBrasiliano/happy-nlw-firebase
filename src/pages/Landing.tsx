import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi'

import logoImg from '../images/Logo.svg';

import '../styles/pages/landing.css';

function Landing() {
    return(
        <div className="content-wrapper">
            <img src={logoImg} alt=""/>

            <main>
            <h1>Leve felicidade para o mundo</h1>
            <p>Visite orfanatos e mude o dia de muitas crianças.</p>
            </main>

            <div className="location">
            <strong>Caucaia</strong>
            <span>Ceará</span>
            </div>

            <Link to="/app" className="enter-app">
                <FiArrowRight size={26} color="rgba(0,0,0,0.6)"/>
            </Link>
        </div>
    );
}

export default Landing;