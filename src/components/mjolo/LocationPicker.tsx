import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface LocationPickerProps {
  onLocationUpdate?: () => void;
}

export function LocationPicker({ onLocationUpdate }: LocationPickerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [location, setLocation] = useState({
    city: '',
    country: '',
    latitude: null as number | null,
    longitude: null as number | null,
    maxDistance: 50
  });

  useEffect(() => {
    if (user) {
      loadUserLocation();
    }
  }, [user]);

  const loadUserLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude, location_city, location_country, max_distance')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setLocation({
          city: data.location_city || '',
          country: data.location_country || '',
          latitude: data.latitude,
          longitude: data.longitude,
          maxDistance: data.max_distance || 50
        });
      }
    } catch (error) {
      console.error('Error loading location:', error);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get city/country names
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTE5OTZrZTEwOGtqMmtzZWd6OXU2NTdnIn0.9HdWGbaF_JYqgYPOgvDnAg&types=place`
          );
          
          if (response.ok) {
            const data = await response.json();
            const place = data.features[0];
            
            if (place) {
              const city = place.text;
              const country = place.properties?.country || place.context?.find((c: any) => c.id.includes('country'))?.text || '';
              
              setLocation(prev => ({
                ...prev,
                latitude,
                longitude,
                city,
                country
              }));
            }
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          setLocation(prev => ({
            ...prev,
            latitude,
            longitude
          }));
        }
        
        setGettingLocation(false);
        toast.success('Location detected successfully!');
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to get your location. Please enter manually.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const saveLocation = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: location.latitude,
          longitude: location.longitude,
          location_city: location.city,
          location_country: location.country,
          max_distance: location.maxDistance
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Location settings saved!');
      onLocationUpdate?.();
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Current Location</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="flex-shrink-0"
            >
              {gettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={location.city}
              onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={location.country}
              onChange={(e) => setLocation(prev => ({ ...prev, country: e.target.value }))}
              placeholder="Enter country"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Maximum Distance: {location.maxDistance} km</Label>
          <Slider
            value={[location.maxDistance]}
            onValueChange={(value) => setLocation(prev => ({ ...prev, maxDistance: value[0] }))}
            max={500}
            min={5}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>5 km</span>
            <span>500 km</span>
          </div>
        </div>

        {location.latitude && location.longitude && (
          <div className="text-sm text-muted-foreground">
            📍 Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
        )}

        <Button onClick={saveLocation} disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            'Save Location Settings'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}