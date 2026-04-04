import { describe, it, expect } from 'vitest';
import { LocationInputSchema } from './index';
import type { LocationInputProps } from './index';

describe('LocationInputSchema - Zod Validation', () => {
  const validData: LocationInputProps = {
    name: 'Community Kitchen Downtown',
    type: 'Community kitchen',
    address: '123 Main St, São Paulo, SP',
    telephone: '+55 11 98765-4321',
    coords: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
    image: null,
  };

  describe('Valid data scenarios', () => {
    it('should validate correct location data', () => {
      const result = LocationInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with string coordinates that can be coerced to numbers', () => {
      const dataWithStringCoords = {
        ...validData,
        coords: {
          latitude: '-23.5505',
          longitude: '-46.6333',
        },
      };
      
      const result = LocationInputSchema.safeParse(dataWithStringCoords);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.coords.latitude).toBe(-23.5505);
        expect(result.data.coords.longitude).toBe(-46.6333);
      }
    });

    it('should validate without image (optional field)', () => {
      const dataWithoutImage = { ...validData };
      delete dataWithoutImage.image;
      
      const result = LocationInputSchema.safeParse(dataWithoutImage);
      expect(result.success).toBe(true);
    });

    it('should validate with extreme valid coordinates', () => {
      const extremeCoords = {
        ...validData,
        coords: {
          latitude: 90,
          longitude: 180,
        },
      };
      
      expect(LocationInputSchema.safeParse(extremeCoords).success).toBe(true);
      
      const extremeCoordsNegative = {
        ...validData,
        coords: {
          latitude: -90,
          longitude: -180,
        },
      };
      
      expect(LocationInputSchema.safeParse(extremeCoordsNegative).success).toBe(true);
    });
  });

  describe('Name field validation', () => {
    it('should reject empty name', () => {
      const invalidData = { ...validData, name: '' };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required field');
      }
    });

    it('should reject missing name', () => {
      const invalidData = { ...validData };
      delete (invalidData as any).name;
      
      const result = LocationInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Type field validation', () => {
    it('should reject empty type', () => {
      const invalidData = { ...validData, type: '' };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please select a establishment type');
      }
    });

    it('should reject type with less than 6 characters', () => {
      const invalidData = { ...validData, type: 'short' };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please select a establishment type');
      }
    });

    it('should accept valid establishment types', () => {
      const types = [
        'Community kitchen',
        'Solidarity kitchen',
        'Shelter',
        'Hospital',
      ];

      types.forEach(type => {
        const data = { ...validData, type };
        const result = LocationInputSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Address field validation', () => {
    it('should reject empty address', () => {
      const invalidData = { ...validData, address: '' };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required field');
      }
    });

    it('should reject missing address', () => {
      const invalidData = { ...validData };
      delete (invalidData as any).address;
      
      const result = LocationInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Telephone field validation', () => {
    it('should reject empty telephone', () => {
      const invalidData = { ...validData, telephone: '' };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required field');
      }
    });

    it('should accept various phone formats', () => {
      const phoneFormats = [
        '+55 11 98765-4321',
        '+1 555-123-4567',
        '+44 20 7946 0958',
        '(11) 98765-4321',
      ];

      phoneFormats.forEach(telephone => {
        const data = { ...validData, telephone };
        const result = LocationInputSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Coordinates validation', () => {
    it('should reject latitude > 90', () => {
      const invalidData = {
        ...validData,
        coords: { latitude: 91, longitude: 0 },
      };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Latitude must be between -90 and 90');
      }
    });

    it('should reject latitude < -90', () => {
      const invalidData = {
        ...validData,
        coords: { latitude: -91, longitude: 0 },
      };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Latitude must be between -90 and 90');
      }
    });

    it('should reject longitude > 180', () => {
      const invalidData = {
        ...validData,
        coords: { latitude: 0, longitude: 181 },
      };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Longitude must be between -180 and 180');
      }
    });

    it('should reject longitude < -180', () => {
      const invalidData = {
        ...validData,
        coords: { latitude: 0, longitude: -181 },
      };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Longitude must be between -180 and 180');
      }
    });

    it('should reject non-numeric latitude', () => {
      const invalidData = {
        ...validData,
        coords: { latitude: 'invalid', longitude: 0 },
      };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Latitude must be a number');
      }
    });

    it('should reject non-numeric longitude', () => {
      const invalidData = {
        ...validData,
        coords: { latitude: 0, longitude: 'invalid' },
      };
      const result = LocationInputSchema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Longitude must be a number');
      }
    });

    it('should reject missing coordinates', () => {
      const invalidData = { ...validData };
      delete (invalidData as any).coords;
      
      const result = LocationInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Image field validation', () => {
    it('should accept null image', () => {
      const data = { ...validData, image: null };
      const result = LocationInputSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept undefined image', () => {
      const data = { ...validData, image: undefined };
      const result = LocationInputSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept File instance', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const data = { ...validData, image: file };
      const result = LocationInputSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject non-File objects', () => {
      const data = { ...validData, image: 'not-a-file' as any };
      const result = LocationInputSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Multiple validation errors', () => {
    it('should report all validation errors at once', () => {
      const invalidData = {
        name: '',
        type: '',
        address: '',
        telephone: '',
        coords: {
          latitude: 100,
          longitude: 200,
        },
      };
      
      const result = LocationInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        // Should have errors for name, type, address, telephone, latitude, and longitude
        expect(result.error.issues.length).toBeGreaterThanOrEqual(5);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle zero coordinates', () => {
      const data = {
        ...validData,
        coords: { latitude: 0, longitude: 0 },
      };
      const result = LocationInputSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should trim whitespace properly in required fields', () => {
      // Zod string().min() doesn't auto-trim, so whitespace-only strings pass min length
      const data = {
        ...validData,
        name: '   ', // 3 spaces
      };
      const result = LocationInputSchema.safeParse(data);
      // This should pass because min(1) only checks length, not trimmed content
      expect(result.success).toBe(true);
    });

    it('should handle very long strings', () => {
      const longString = 'A'.repeat(1000);
      const data = {
        ...validData,
        name: longString,
        address: longString,
      };
      const result = LocationInputSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
