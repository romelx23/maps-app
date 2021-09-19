import React, { useEffect } from 'react'
import { useMapbox } from '../hooks/useMapbox';

const puntoIncial={
    lng:-122.4725,
    lat:37.8010,
    zoom:13.5
}

export const MapaPage = () => {

    // const [mapa, setMapa] = useState();//Antes usabamos un State para mantener el estado del mapa
    const {setRef,coords,nuevoMarcador$,movimientoMarcador$}=useMapbox(puntoIncial);

    // Nuevo Marcador
    useEffect(() => {

        nuevoMarcador$.subscribe(marcador=>{
            // console.log(marcador)
            // TODO nuevo marcador emitir
        })

    }, [nuevoMarcador$])

    // TODO Mover movimiento de marcador
    useEffect(() => {
        movimientoMarcador$.subscribe((marcador)=>{
            console.log(marcador)
        })

    }, [movimientoMarcador$])
    
    return (
        <div>
            <div className="info">
                Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
            </div>
            <div 
            ref={setRef}
            className="mapContainer"></div>
        </div>
    )
}
