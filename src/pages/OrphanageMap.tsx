import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
/** Componentes */

/** Utils */
import mapIcon from '../utils/mapIcon';
import firebase from '../config/firebase';
/** Imagens */
import mapMarkerImg from '../images/Local.svg';
/** Styles */
import '../styles/pages/orphanage-map.css'

function OrphanageMap() {
    const [currentPosition, SetCurrentPosition] = useState({ latitude:0, longitude:0 })
    const [listOrphanage, setListOrphanage] = useState([{}]);
    const [loading, setLoading] = useState(true);

    function setPosition(position:any){
        SetCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }); 
    }
    function showError(error:any){
        switch(error.code){
            case error.PERMISSION_DENIED:
                alert("Usuário rejeitou a solicitação de Geolocalização.");
                SetCurrentPosition({
                    latitude: -3.7442012,
                    longitude: -38.5369471
                }); 
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Localização indisponível.");
                break;
            case error.TIMEOUT:
                alert("A requisição expirou.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Algum erro desconhecido aconteceu.");
                break;
        }
    }

    useEffect(() => {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(setPosition ,showError);
        }
        else{
            alert("Seu browser não suporta Geolocalização.");
        }
    },[])

    useEffect(() => {
        firebase.database().ref('orphanage/').once('value').then(( snapshot ) => {
            const lista:any[] = []
            snapshot.forEach( value => {
                const orfanato = {
                    key: value.key,
                    name: value.val().name ,
                    about: value.val().about,
                    latitude: value.val().latitude ,
                    longitude: value.val().longitude ,
                    instructions: value.val().instructions ,
                    opening_hours: value.val().opening_hours ,
                    open_on_weekend: value.val().open_on_weekend
                }
                lista.push(orfanato);
            });
            setListOrphanage(lista);
            setLoading(false);
        })
    },[])
    
    return(
        <>
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
                    center={[currentPosition.latitude,currentPosition.longitude]}
                    zoom={15}
                    style={{ width:'100%', height:'100%' }}
                >
                    <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />    

                    {
                        !loading ? 
                            listOrphanage.map( ( orphanage:any ) => {
                                return(
                                    <Marker
                                        key={orphanage.key}
                                        icon={mapIcon}
                                        position={[orphanage.latitude,orphanage.longitude]}
                                    >
                                        <Popup 
                                            closeButton={false} 
                                            minWidth={240} 
                                            maxWidth={240} 
                                            className="map-popup"
                                        >
                                            {orphanage.name}
                                            <Link to={`orphanagemap/${orphanage.key}`}>
                                                <FiArrowRight size={20} color="#fff"/> 
                                            </Link>
                                        </Popup>
                                    </Marker>        
                                )
                            })
                            :
                            null
                    }
                </Map>

                <Link to="orphanagemap/create" className="create-orphanage">
                    <FiPlus size={32} color="#fff"/>
                </Link>

            </div>
        </>
    );
}

export default OrphanageMap;