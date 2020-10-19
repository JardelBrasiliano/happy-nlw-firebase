import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
/** Componentes */

/** Utils */
import mapIcon from '../utils/mapIcon';
/** Imagens */
import mapMarkerImg from '../images/Local.svg';
/** Styles */
import '../styles/pages/orphanage-map.css'

function OrphanageMap() {
    return(
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt=""/>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita:)</p>
                </header>

                <footer>
                    <strong>Caucaia</strong>
                    <span>Ceará</span>
                </footer>
            </aside>
            
            <Map
                center={[-3.7349345,-38.571092]}
                zoom={15}
                style={{ width:'100%', height:'100%' }}
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />    

                <Marker
                    icon={mapIcon}
                    position={[-3.7349345,-38.571092]}
                >
                    <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                        Lar das meninas
                        <Link to="orphanagemap/1">
                            <FiArrowRight size={20} color="#fff"/> 
                        </Link>
                    </Popup>
                </Marker>

            </Map>

            <Link to="orphanagemap/create" className="create-orphanage">
                <FiPlus size={32} color="#fff"/>
            </Link>

        </div>
    );
}

export default OrphanageMap;