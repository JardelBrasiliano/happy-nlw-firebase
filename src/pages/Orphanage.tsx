import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom';
/* Componentes */
import Sidebar from "../components/Sidebar";
/* Utils */
import mapIcon from '../utils/mapIcon';
import firebase from '../config/firebase';
  
import '../styles/pages/orphanage.css';

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: string;
  images: Array<[]>;
}

interface OrphanageParams {
  id: string;
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [imagens, setImagens] = useState<any[]>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    if(loading){
      firebase.database().ref(`orphanage/${params.id}`).once('value').then(( snapshot ) => {
        setOrphanage(snapshot.val());
        setLoading(false);
        let listAux: any[] = [];
        snapshot.val().images.forEach((img:any) => {
          firebase.storage().ref(`imagens/${img}`).getDownloadURL().then((url) => {
            listAux.push(url);
            setImagens([listAux])
          })
          setLoading(false);
        });
        
      })
    }
    
  }, [params.id]);


  if (!orphanage || !imagens) {
    return <h1>Carregando...</h1>
  }

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <>
            <img src={imagens[0][activeImageIndex]} alt={orphanage.name} />

            <div className="images">
              {imagens[0].map((image: string, index: number) => {
                return (
                  <button 
                    key={`${image}_${index}`} 
                    className={activeImageIndex === index ? 'active' : ''}
                    type="button"
                    onClick={(e) => setActiveImageIndex(index) }
                  >
                    <img src={image} id={`${index}`} alt={orphanage.name} />
                  </button>
                );
              })}
            </div>
          </>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude,orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude,orphanage.longitude]} />
              </Map>

              <footer>
                <a href="">Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>{orphanage.instructions}</h2>
            <p>Venha como se sentir mais à vontade e traga muito amor para dar.</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              { orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF6690" />
                  Não atendemos <br />
                  fim de semana
                </div>
              )}
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}