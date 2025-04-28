import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import apartments from "leaflet";

// Фікс для іконок маркерів
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const InteractiveMap = ({ apartments = [], selectedApartment }) => {
    useEffect(() => {
        // Ініціалізація картографічної бібліотеки
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: icon,
            iconUrl: icon,
            shadowUrl: iconShadow,
        });
    }, []);

    const getCoordinates = (apartment) => {
        if (!apartment?.coordinates) return null;
        const lat = parseFloat(apartment.coordinates.lat);
        const lng = parseFloat(apartment.coordinates.lng);
        return !isNaN(lat) && !isNaN(lng) ? [lat, lng] : null;
    };

    const center = getCoordinates(selectedApartment) ||
        getCoordinates(apartments[0]) ||
        [50.4501, 30.5234];

    console.log('All apartments:', apartments.map(a => ({
        id: a.id,
        coords: a.coordinates
    })));

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {apartments.map(apartment => {
                    const coords = getCoordinates(apartment);
                    return coords ? (
                        <Marker
                            key={apartment.id}
                            position={coords}
                            icon={DefaultIcon}
                        >
                            <Popup>
                                <h3>{apartment.title}</h3>
                                <p>{apartment.price}</p>
                            </Popup>
                        </Marker>
                    ) : null;
                })}
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;