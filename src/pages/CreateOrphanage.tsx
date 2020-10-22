import React, { ChangeEvent, FormEvent, useState} from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiPlus } from "react-icons/fi";
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from 'react-router-dom';
/** Componentes */
import Sidebar from '../components/Sidebar';
import { GrClose } from 'react-icons/gr'
/** Utils */
import firebase from "../config/firebase";
import mapIcon from '../utils/mapIcon';
/** Style */
import '../styles/pages/create-orphanage.css';

export default function CreateOrphanage() {
  const history = useHistory();

  const[position, SetPosition] = useState({ latitude:0, longitude:0 })

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [open_hours, setOpenHours] = useState('');
  const [close_hours, setCloseHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [erro, setErro] = useState(false);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    
    SetPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImagens(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files){
      return;
    }

    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    })

    setPreviewImages(selectedImagesPreview);
  }
  
  async function handleSubmit(event:FormEvent) {
    event.preventDefault();
    let erroSizeImage = true;
    const { latitude, longitude } = position;
    const OpeningHours = `De ${open_hours} a ${close_hours}`
    
    if((images.length > 0) && !!latitude && !!longitude){
      let listAux: any[] = [];
      
      images.forEach((imagem, index) => {
        console.log(imagem.size);
        
        if(imagem.size > 60000){
          alert('tamanho da imagem muito grande');
          erroSizeImage = false;
          setErro(true)
          return ;
        }      
        listAux[index] = imagem.name;
      });
      setImages(listAux);
      
      const orphanage = {
        name,
        about,
        images: listAux,
        latitude,
        longitude,
        instructions,
        opening_hours: OpeningHours,
        open_on_weekends
      }
      if(erroSizeImage){
        images.forEach((imagem) => {
          firebase.storage().ref(`imagens/${imagem.name}`).put(imagem).then(() => {
          }).catch(() => { return alert('erro no upload da imagem'); })
        })

        firebase.database().ref('orphanage/').push(orphanage).then(() => {
          alert('Cadastro realizado com sucesso!');
      
          history.push('/app');
        }).catch(() => {
          alert('algo de errado não esta certo.')
        })
      }
    }else{ 
      alert('Coloque uma imagem ou sua localização no mapa.')
      SetPosition({
        latitude: 0,
        longitude: 0
      });
      setErro(true);
    }
  }

    
  function removeImage(click:any, list: any[]) {
    const imagemClick = +click.id;
    const listImg = click.parentNode.parentNode
    let newList: any[] = []
    let aux = 0;
    
    if(list.length > 0){
      listImg.removeChild(click.parentNode);      
      for (let i = 0; i < list.length; i++) {
        if(imagemClick !== i){
          newList[aux++] = list[i]
        }
      }
      setImages(newList)
    }
    
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar/>

      <main>
        <form className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-3.7384076,-38.5706679]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              />
              { position.latitude !== 0 && (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[position.latitude,position.longitude]} 
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <ul className="images-container">
                {previewImages.map((image, index) => (
                  <li key={`${index}`}  onClick={(e) => removeImage(e.target ,images) } >
                    <GrClose className="close-image"/>
                    <img id={`${index}`}  key={image} src={image} alt={name}/>
                  </li>
                ))}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </ul>

              <input 
                id="image[]"
                multiple 
                onChange={handleSelectImagens} 
                type="file"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcinamento</label>
              <label htmlFor="open_hours">De</label>
              <input 
                id="open_hours"
                type="time" 
                min="00:00" 
                max="24:00" 
                onChange={event => setOpenHours(event.target.value)}
                required>
              </input>
              <label htmlFor="close_hours">a</label>
              <input 
                id="close_hours" 
                type="time" 
                min="00:00" 
                max="24:00" 
                onChange={event => setCloseHours(event.target.value)}
                required>
              </input>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button onClick={handleSubmit} className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

