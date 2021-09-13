import React from 'react';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';

export default function Map({ location, name, height }) {

    const openAppMap = () => {
        openMap({
            zoom: 19,
            query: `${location.latitude},${location.longitude}`
        })
    }

    return (
        <MapView
            style={{ height: height, width: "100%" }}
            initialRegion={location}
            onPress={openAppMap}
        >
            <MapView.Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}
