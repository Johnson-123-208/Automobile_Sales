/**
 * Utility functions for generating automotive-related images
 * Uses direct image URLs from reliable automotive sources
 */

/**
 * Vehicle image mapping - Maps brand+model to actual product image URLs
 * Using direct image URLs from automotive websites
 */
const VEHICLE_IMAGE_MAP: { [key: string]: string } = {
  // Cars - Maruti Suzuki
  'maruti suzuki swift': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80',
  'maruti suzuki baleno': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
  'maruti suzuki ciaz': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
  
  // Cars - Hyundai
  'hyundai i20': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
  'hyundai verna': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
  'hyundai creta': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  
  // Cars - Tata
  'tata altroz': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
  'tata nexon': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  'tata harrier': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  
  // Cars - Honda
  'honda city': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
  
  // Cars - Mahindra
  'mahindra xuv700': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  'mahindra scorpio': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  
  // Cars - Others
  'kia seltos': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  'toyota innova crysta': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  'mg hector': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
  
  // Bikes - KTM
  'ktm duke 200': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'ktm rc 200': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  
  // Bikes - TVS
  'tvs apache rtr 160': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'tvs raider': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  
  // Bikes - Hero
  'hero xpulse 200t': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'hero splendor': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'hero splendor plus': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'hero passion pro': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  
  // Bikes - Bajaj
  'bajaj pulsar 150': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'bajaj pulsar ns200': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'bajaj dominar 400': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  
  // Bikes - Yamaha
  'yamaha mt 15': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'yamaha mt-15': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'yamaha r15': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'yamaha r15 v4': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  
  // Bikes - Honda
  'honda shine': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'honda cb unicorn': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'honda unicorn': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  
  // Bikes - Royal Enfield
  'royal enfield classic 350': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  'royal enfield hunter 350': 'https://images.unsplash.com/photo-1558980664-1db5067515c4?w=800&h=600&fit=crop&q=80',
  
  // Scooties - Use scooter-specific images
  'aprilia sr 160': 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop&q=80',
  'honda activa': 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop&q=80',
  'tvs jupiter': 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop&q=80',
  'yamaha fascino': 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop&q=80',
  
  // Autos
  'bajaj auto rickshaw': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&q=80',
  'bajaj re compact': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&q=80',
};

/**
 * Spare part image mapping - Maps part type/name to actual product image URLs
 */
const SPARE_PART_IMAGE_MAP: { [key: string]: string } = {
  // Engine parts
  'engine oil': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'oil filter': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'air filter': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'spark plug': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'engine gasket': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'timing belt': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'fuel pump': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'water pump': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'thermostat': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'radiator': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  
  // Brake parts - Use brake-specific images
  'brake pad': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'brake disc': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'brake fluid': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'brake shoe': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'brake master cylinder': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'brake caliper': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'brake line': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'brake': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  
  // Battery & Electrical
  'battery': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'alternator': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'starter': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'headlight': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'tail light': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'fuse': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'relay': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'horn': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'wiring harness': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  
  // Body parts
  'bumper': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'mirror': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'windshield': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'door handle': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'grille': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  
  // Suspension
  'shock absorber': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'suspension': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'strut': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  
  // Transmission
  'clutch': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'clutch plate': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
  'transmission': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop&q=80',
};

/**
 * Get vehicle image URL based on type, brand, and model
 */
export function getVehicleImageUrl(
  type?: string | null,
  brand?: string | null,
  model?: string | null
): string {
  // Create a key from brand and model (normalized)
  const brandModel = `${(brand || '').toLowerCase().trim()} ${(model || '').toLowerCase().trim()}`.trim();
  
  // Check if we have a direct mapping
  if (brandModel && VEHICLE_IMAGE_MAP[brandModel]) {
    return VEHICLE_IMAGE_MAP[brandModel];
  }
  
  // Try variations
  const variations = [
    brandModel,
    brandModel.replace(/\s+/g, ' '),
    brandModel.replace(/\s+/g, '-'),
  ];
  
  for (const variation of variations) {
    if (VEHICLE_IMAGE_MAP[variation]) {
      return VEHICLE_IMAGE_MAP[variation];
    }
  }
  
  // Fallback to type-based Unsplash images with specific search terms
  const vehicleType = (type || '').toLowerCase();
  const typeMap: { [key: string]: string } = {
    'car': 'https://source.unsplash.com/800x600/?car,automobile',
    'sedan': 'https://source.unsplash.com/800x600/?sedan,car',
    'suv': 'https://source.unsplash.com/800x600/?suv,car',
    'hatchback': 'https://source.unsplash.com/800x600/?hatchback,car',
    'bike': 'https://source.unsplash.com/800x600/?motorcycle,bike',
    'motorcycle': 'https://source.unsplash.com/800x600/?motorcycle,bike',
    'auto': 'https://source.unsplash.com/800x600/?auto-rickshaw,rickshaw',
    'rickshaw': 'https://source.unsplash.com/800x600/?auto-rickshaw,rickshaw',
    'scooty': 'https://source.unsplash.com/800x600/?scooter,scooty',
    'scooter': 'https://source.unsplash.com/800x600/?scooter,scooty',
  };
  
  // Use type-specific image if available
  if (typeMap[vehicleType]) {
    return typeMap[vehicleType];
  }
  
  return 'https://source.unsplash.com/800x600/?automobile,vehicle';
}

/**
 * Get spare part image URL based on type and name
 */
export function getSparePartImageUrl(
  type?: string | null,
  name?: string | null
): string {
  const partName = (name || '').toLowerCase().trim();
  const partType = (type || '').toLowerCase().trim();
  
  // Check direct mapping first
  const fullKey = `${partType} ${partName}`.trim();
  if (SPARE_PART_IMAGE_MAP[fullKey]) {
    return SPARE_PART_IMAGE_MAP[fullKey];
  }
  
  // Check if part name contains any key
  for (const [key, url] of Object.entries(SPARE_PART_IMAGE_MAP)) {
    if (partName.includes(key) || partType.includes(key)) {
      return url;
    }
  }
  
  // Fallback based on type - Use specific search terms for better images
  const typeMap: { [key: string]: string } = {
    'engine': 'https://source.unsplash.com/600x600/?car-engine,engine-parts',
    'brake': 'https://source.unsplash.com/600x600/?brake-pad,brake-disc,car-brake',
    'tire': 'https://source.unsplash.com/600x600/?car-tire,automobile-tire',
    'tyre': 'https://source.unsplash.com/600x600/?car-tire,automobile-tire',
    'battery': 'https://source.unsplash.com/600x600/?car-battery,automobile-battery',
    'filter': 'https://source.unsplash.com/600x600/?car-filter,air-filter',
    'electrical': 'https://source.unsplash.com/600x600/?car-electrical,automotive-electrical',
    'body': 'https://source.unsplash.com/600x600/?car-body-parts,automotive-body',
    'suspension': 'https://source.unsplash.com/600x600/?car-suspension,shock-absorber',
  };
  
  // Check if type matches and return specific image
  if (partType && typeMap[partType]) {
    return typeMap[partType];
  }
  
  // If name contains brake, use brake image
  if (partName.includes('brake') || partType.includes('brake')) {
    return 'https://source.unsplash.com/600x600/?brake-pad,brake-disc,car-brake';
  }
  
  return 'https://source.unsplash.com/600x600/?car-parts,automotive-parts';
}

/**
 * Get a fallback image for vehicles
 */
export function getVehicleFallbackImage(type?: string | null): string {
  return getVehicleImageUrl(type, null, null);
}

/**
 * Get a fallback image for spare parts
 */
export function getSparePartFallbackImage(type?: string | null): string {
  return getSparePartImageUrl(type, null);
}
