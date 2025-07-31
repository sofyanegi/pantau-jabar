'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import { CCTV } from '@/types/cctv';
import { Skeleton } from '../ui/skeleton';
import { CCTVFilterSearch } from '../cctv/cctv-filter-search';

const CCTVCard = dynamic(() => import('@/components/cctv/cctv-card'), { ssr: false });

const cctvIcon = L.icon({
  iconUrl: '/cctv.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const defaultCenter: [number, number] = [-6.89, 107.609];

export default function CCTVMapPage() {
  const [allCCTV, setAllCCTV] = useState<CCTV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCCTVs = async () => {
      try {
        const res = await fetch('/api/cctvs');
        if (!res.ok) throw new Error('Failed to fetch CCTVs');
        const data = await res.json();
        setAllCCTV(data.data);
      } catch (err) {
        console.error('Error fetching CCTV data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCCTVs();
  }, []);

  const createClusterIcon = useMemo(
    () => (cluster: any) =>
      L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-[#0078A8] text-white font-semibold border-2 border-white shadow-lg">
          ${cluster.getChildCount()}
        </div>`,
        className: '',
        iconSize: L.point(40, 40, true),
      }),
    []
  );

  return (
    <div className="h-min-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white ">
      {loading ? (
        <Skeleton className="h-[75vh] w-full" />
      ) : (
        <>
          <MapContainer center={defaultCenter} zoom={9} maxZoom={16} className="h-[80vh] w-full rounded-lg shadow-lg relative z-0" zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <ZoomControl position="bottomright" />

            <MarkerClusterGroup
              showCoverageOnHover
              maxClusterRadius={40}
              polygonOptions={{ color: 'blue', weight: 5, opacity: 0.5 }}
              spiderLegPolylineOptions={{ weight: 5, color: 'blue', opacity: 0.5 }}
              iconCreateFunction={createClusterIcon}
            >
              {allCCTV.map((cctv: CCTV) => (
                <Marker key={cctv.id} position={[+cctv.lat, +cctv.lng]} icon={cctvIcon}>
                  <Popup>
                    <CCTVCard cctv={cctv} />
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </>
      )}
    </div>
  );
}
