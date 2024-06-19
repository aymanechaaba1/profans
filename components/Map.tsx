'use client';

import React from 'react';
import {
  APIProvider,
  Map as ReactMap,
  Pin,
  AdvancedMarker,
  Marker,
} from '@vis.gl/react-google-maps';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function Map({
  lat,
  lng,
  defaultZoom,
  className,
}: {
  lat: number;
  lng: number;
  defaultZoom?: number;
  className?: string;
}) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!}>
      <ReactMap
        defaultCenter={{ lat, lng }}
        defaultZoom={defaultZoom || 16}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className={cn('w-full h-[500px] rounded-lg', className)}
        styles={[
          {
            stylers: [
              { hue: '#ff1a00' },
              { invert_lightness: true },
              { saturation: -100 },
              { lightness: 33 },
              { gamma: 0.5 },
            ],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#2D333C' }],
          },
        ]}
      >
        <Marker position={{ lat, lng }} />
      </ReactMap>
    </APIProvider>
  );
}

export default Map;
