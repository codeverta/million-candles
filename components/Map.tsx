import L from 'leaflet';
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css';
import Layout from 'components/layout/Landing'

export default function DynamicMap() {
	const mapContainer = useRef();
	useEffect(() => {
    const map = L.map(mapContainer.current, {attributionControl: false}).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
		return () => map.remove();

	}, [])
	return (
		<Layout>
			<div 
			style={{padding: 0, margin: 0, width: "100%", height: "100vh",}}
			id="map" ref={el => mapContainer.current = el}></div>
		</Layout>
	)
} 
