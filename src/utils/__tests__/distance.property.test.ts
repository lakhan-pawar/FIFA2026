import { calculateDistance } from '../index';

/**
 * Property-based test for distance calculation
 * **Validates: Requirements 3.4**
 */

describe('Distance Calculation Properties', () => {
  // Property: Distance is always non-negative
  it('should always return non-negative distance', () => {
    for (let i = 0; i < 100; i++) {
      const lat1 = (Math.random() - 0.5) * 180; // -90 to 90
      const lon1 = (Math.random() - 0.5) * 360; // -180 to 180
      const lat2 = (Math.random() - 0.5) * 180;
      const lon2 = (Math.random() - 0.5) * 360;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      expect(distance).toBeGreaterThanOrEqual(0);
    }
  });

  // Property: Distance from a point to itself is zero
  it('should return zero distance for identical coordinates', () => {
    for (let i = 0; i < 50; i++) {
      const lat = (Math.random() - 0.5) * 180;
      const lon = (Math.random() - 0.5) * 360;

      const distance = calculateDistance(lat, lon, lat, lon);
      expect(distance).toBe(0);
    }
  });

  // Property: Distance is symmetric (d(A,B) = d(B,A))
  it('should be symmetric', () => {
    for (let i = 0; i < 50; i++) {
      const lat1 = (Math.random() - 0.5) * 180;
      const lon1 = (Math.random() - 0.5) * 360;
      const lat2 = (Math.random() - 0.5) * 180;
      const lon2 = (Math.random() - 0.5) * 360;

      const distance1 = calculateDistance(lat1, lon1, lat2, lon2);
      const distance2 = calculateDistance(lat2, lon2, lat1, lon1);

      expect(distance1).toBe(distance2);
    }
  });

  // Property: Triangle inequality (d(A,C) <= d(A,B) + d(B,C))
  it('should satisfy triangle inequality', () => {
    for (let i = 0; i < 30; i++) {
      const lat1 = (Math.random() - 0.5) * 180;
      const lon1 = (Math.random() - 0.5) * 360;
      const lat2 = (Math.random() - 0.5) * 180;
      const lon2 = (Math.random() - 0.5) * 360;
      const lat3 = (Math.random() - 0.5) * 180;
      const lon3 = (Math.random() - 0.5) * 360;

      const distanceAC = calculateDistance(lat1, lon1, lat3, lon3);
      const distanceAB = calculateDistance(lat1, lon1, lat2, lon2);
      const distanceBC = calculateDistance(lat2, lon2, lat3, lon3);

      expect(distanceAC).toBeLessThanOrEqual(distanceAB + distanceBC + 0.001); // Small tolerance for floating point
    }
  });

  // Property: Known distance verification (Toronto venues)
  it('should calculate reasonable distances for Toronto venues', () => {
    // Toronto City Hall coordinates
    const torontoCityHall = { lat: 43.6534, lng: -79.3839 };

    // CN Tower coordinates (approximately 1.2 km from City Hall)
    const cnTower = { lat: 43.6426, lng: -79.3871 };

    const distance = calculateDistance(
      torontoCityHall.lat,
      torontoCityHall.lng,
      cnTower.lat,
      cnTower.lng
    );

    // Should be approximately 1.2 km (allowing for some variance)
    expect(distance).toBeGreaterThan(1.0);
    expect(distance).toBeLessThan(1.5);
  });

  // Property: Distance should be reasonable for Toronto area venues
  it('should return reasonable distances for Toronto area coordinates', () => {
    // Toronto bounds approximately
    const torontoBounds = {
      minLat: 43.58,
      maxLat: 43.85,
      minLng: -79.64,
      maxLng: -79.12,
    };

    for (let i = 0; i < 50; i++) {
      const lat1 =
        torontoBounds.minLat +
        Math.random() * (torontoBounds.maxLat - torontoBounds.minLat);
      const lon1 =
        torontoBounds.minLng +
        Math.random() * (torontoBounds.maxLng - torontoBounds.minLng);
      const lat2 =
        torontoBounds.minLat +
        Math.random() * (torontoBounds.maxLat - torontoBounds.minLat);
      const lon2 =
        torontoBounds.minLng +
        Math.random() * (torontoBounds.maxLng - torontoBounds.minLng);

      const distance = calculateDistance(lat1, lon1, lat2, lon2);

      // Distance within Toronto should be reasonable (less than 100km)
      expect(distance).toBeLessThan(100);
      expect(distance).toBeGreaterThanOrEqual(0);
    }
  });
});
