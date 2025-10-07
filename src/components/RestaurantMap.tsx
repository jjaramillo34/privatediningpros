'use client';

import { useEffect, useRef, useState } from 'react';
import { IRestaurant } from '@/lib/restaurant.model';
import { MapPin, Star } from 'lucide-react';

interface RestaurantMapProps {
  restaurants: IRestaurant[];
  selectedRestaurant?: string;
  onRestaurantSelect?: (restaurantId: string) => void;
}

export default function RestaurantMap({ restaurants, selectedRestaurant, onRestaurantSelect }: RestaurantMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [hasValidCoordinates, setHasValidCoordinates] = useState(false);

  useEffect(() => {
    // Only load mapbox if we have the token
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.warn('Mapbox token not found');
      return;
    }

    // Dynamically import mapbox-gl to avoid SSR issues
    const loadMapbox = async () => {
      try {
        const mapboxglModule = (await import('mapbox-gl')).default;
        setMapboxgl(mapboxglModule);
        mapboxglModule.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

        if (map.current) return; // initialize map only once

        // Initialize map
        map.current = new mapboxglModule.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-73.9857, 40.7484], // NYC coordinates
          zoom: 13, // Increased zoom to focus on Manhattan
          attributionControl: false,
          maxBounds: [
            [-74.1, 40.6], // Southwest corner
            [-73.8, 40.9]  // Northeast corner
          ]
        });

        map.current.on('load', () => {
          setIsLoaded(true);
          
        });

        // Add navigation controls
        map.current.addControl(new mapboxglModule.NavigationControl(), 'top-right');

      } catch (error) {
        console.error('Error loading Mapbox:', error);
      }
    };

    loadMapbox();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const addRestaurantMarkers = () => {
    if (!map.current || !isLoaded || !mapboxgl) return;

    // Clear existing markers
    markers.current.forEach((marker: any) => marker.remove());
    markers.current = [];

    let validCoordinates = 0;
    let missingCoordinates = 0;
    const bounds = new mapboxgl.LngLatBounds();

    restaurants.forEach((restaurant, index) => {
      // Check if we have coordinates
      let lat = restaurant.latitude;
      let lng = restaurant.longitude;
      
      // Check for coordinates (including string numbers)
      if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
        missingCoordinates++;
        return;
      }
      
      // Convert to numbers if they're strings
      lat = Number(lat);
      lng = Number(lng);
      
      validCoordinates++;
      
      // Extend bounds to include this restaurant
      bounds.extend([lng, lat]);

      // Use simple default Mapbox markers for testing
      let markerColor = '#3b82f6'; // Default blue
      
      if (restaurant.featured) {
        markerColor = '#eab308'; // Yellow for featured
      } else if (restaurant.rating && restaurant.rating >= 4.5) {
        markerColor = '#22c55e'; // Green for top-rated
      }

      // Create popup content
      const popupContent = `
        <div class="p-3 max-w-xs">
          <div class="flex items-center space-x-2 mb-2">
            ${restaurant.featured ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>Featured</span>' : ''}
            ${restaurant.rating ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${restaurant.rating}</span>` : ''}
          </div>
          <h3 class="font-semibold text-gray-900 text-sm mb-1">${restaurant.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${restaurant.neighborhood ? `${restaurant.neighborhood}, ` : ''}${restaurant.city}, ${restaurant.state}</p>
          <p class="text-xs text-gray-500 mb-2">${restaurant.privateRooms?.length || 0} private rooms</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-blue-600 font-medium">View Details</span>
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(popupContent);

      // Create marker with appropriate color
      const marker = new mapboxgl.Marker({ 
        color: markerColor,
        anchor: 'center'
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);

      // Add click handler to marker element
      const markerElement = marker.getElement();
      markerElement.addEventListener('click', () => {
        if (onRestaurantSelect && restaurant._id) {
          onRestaurantSelect(restaurant._id.toString());
        }
        // Center map on restaurant
        map.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          duration: 1000
        });
      });

      markers.current.push(marker);
    });

    // Fit map to show all restaurants with padding
    if (validCoordinates > 0) {
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 14 // Don't zoom in too much
      });
    }

    // Update state based on whether we have valid coordinates
    setHasValidCoordinates(validCoordinates > 0);
  };

  // Update markers when restaurants or selectedRestaurant changes
  useEffect(() => {
    if (isLoaded && mapboxgl) {
      addRestaurantMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurants, selectedRestaurant, isLoaded, mapboxgl]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="h-96 md:h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Map Not Available</h4>
          <p className="text-gray-600">Mapbox token not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full h-96 md:h-[500px] rounded-2xl"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <h5 className="font-semibold text-gray-900 mb-3">Legend</h5>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border border-white shadow-sm"></div>
            <span className="text-sm text-gray-600">Restaurants</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full border border-white shadow-sm flex items-center justify-center">
              <Star className="w-2 h-2 text-white fill-current" />
            </div>
            <span className="text-sm text-gray-600">Featured</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border border-white shadow-sm"></div>
            <span className="text-sm text-gray-600">Top Rated (4.5+)</span>
          </div>
        </div>
      </div>

      {/* No Restaurants Message */}
      {restaurants.length === 0 && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
          <div className="text-center p-6">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No Restaurants Found</h4>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see restaurants on the map.</p>
            <div className="text-sm text-gray-500">
              Showing {restaurants.length} restaurants
            </div>
          </div>
        </div>
      )}

      {/* Restaurants without coordinates message - only show if no valid coordinates found */}
      {restaurants.length > 0 && !hasValidCoordinates && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
          <div className="text-center p-6">
            <MapPin className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Restaurants Found</h4>
            <p className="text-gray-600 mb-4">
              Found {restaurants.length} restaurants, but they don't have location coordinates yet.
            </p>
            <div className="text-sm text-gray-500">
              Contact support to add location data for these restaurants.
            </div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button 
          className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow"
          onClick={() => {
            if (map.current) {
              map.current.flyTo({
                center: [-73.9857, 40.7484],
                zoom: 11,
                duration: 1000
              });
            }
          }}
        >
          <MapPin className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
