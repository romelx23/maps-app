import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import {Subject} from 'rxjs';
mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9tZWx4MjMiLCJhIjoiY2t0Z2Y4dTRoMGhtZTJ3dWVwM2hmYmdsOCJ9.6dBNrJHEEEI_IecPKI_NdA";

export const useMapbox = (puntoIncial) => {
  // Referenciar al Div del mapa//Memorizamos el resultado de la funcion
  const mapaDiv = useRef();
  const setRef = useCallback((nodo) => {
    mapaDiv.current = nodo;
  }, []);

  // Referencia para los marcadores
  const marcadores = useRef({});

  //   Observables de Rxjs
  const movimientoMarcador=useRef( new Subject() );
  const nuevoMarcador=useRef( new Subject() );

  

  //   Mapara coords
  const mapa = useRef();
  const [coords, setCoords] = useState(puntoIncial);
  //   funcion para agregar marcadores
  const agreagrMarcador=useCallback((ev)=>{
    const { lng, lat } = ev.lngLat;
    // Método par acrear un nuevo marcador
    const marker = new mapboxgl.Marker();
    marker.id = v4(); //TODO si el marcador ya tiene ID

    marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);

    // Asignamos al objeto de marcadores
    marcadores.current[marker.id] = marker;

    // TODO si el marcadore tiene id no emitir
    nuevoMarcador.current.next({
        id:marker.id,
        lng,
        lat
    });

    // escuchar movimientos del marcador
    marker.on('drag',({target})=>{
        const {id}=target;
        const {lng,lat}=target.getLngLat();
        // console.log(lng,lat)
        // TODO EMITIR LOS CAMBIOS DEL MARCADOR
        movimientoMarcador.current.next({
            id,
            lng,
            lat
        });
    })

  },[])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [puntoIncial.lng, puntoIncial.lat],
      zoom: puntoIncial.zoom,
    });
    mapa.current = map;
  }, [puntoIncial]);

  // Cuando se mueve el maopa
  useEffect(() => {
    mapa.current?.on("move", () => {
      const { lng, lat } = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2),
      });
    });
    return mapa.current?.off("move");
  }, []);

  // Agregar Marcadores cuando hacemos click
  useEffect(() => {
    mapa.current?.on("click", (ev) => {
        agreagrMarcador(ev)
    });
  }, [agreagrMarcador]);

  return {
    agreagrMarcador,
    coords,
    marcadores,
    nuevoMarcador$:nuevoMarcador.current,
    movimientoMarcador$:movimientoMarcador.current,
    setRef,
  };
};
