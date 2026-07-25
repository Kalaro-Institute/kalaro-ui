import { useState, useEffect } from 'react';

// Base prices in USD
export const BASE_PRICES: Record<string, number> = {
  "Introduction to HMO Operations": 350,
  "HMO Claims Management": 450,
  "Provider Relations & Network Management": 400,
  "Health Insurance Fundamentals": 250,
  "HMO Financial Management": 600,
  "Healthcare Compliance & Regulation": 500,
  "HMO Customer Service Excellence": 200,
  "Utilization Management & Care Coordination": 550,
};

// Regional pricing multipliers and currency configurations
export const REGIONAL_PRICING: Record<string, {
  currency: string;
  symbol: string;
  multiplier: number;
  locale: string;
  countries: string[];
}> = {
  "USD": {
    currency: "USD",
    symbol: "$",
    multiplier: 1.0,
    locale: "en-US",
    countries: ["US", "CA", "AG", "BS", "BB", "BZ", "DM", "GD", "GY", "HT", "JM", "MX", "PA", "KN", "LC", "VC", "TT"]
  },
  "EUR": {
    currency: "EUR",
    symbol: "€",
    multiplier: 0.92,
    locale: "de-DE",
    countries: ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PT", "IE", "FI", "GR", "LU", "DK", "SE", "PL", "CZ", "HU", "RO", "BG", "HR", "SK", "SI", "LT", "LV", "EE", "MT", "CY"]
  },
  "GBP": {
    currency: "GBP",
    symbol: "£",
    multiplier: 0.79,
    locale: "en-GB",
    countries: ["GB", "UK", "GG", "IM", "JE", "GI"]
  },
  "NGN": {
    currency: "NGN",
    symbol: "₦",
    multiplier: 1550,
    locale: "en-NG",
    countries: ["NG", "Nigeria"]
  },
  "KES": {
    currency: "KES",
    symbol: "KSh",
    multiplier: 153,
    locale: "en-KE",
    countries: ["KE", "Kenya"]
  },
  "GHS": {
    currency: "GHS",
    symbol: "₵",
    multiplier: 15.5,
    locale: "en-GH",
    countries: ["GH", "Ghana"]
  },
  "ZAR": {
    currency: "ZAR",
    symbol: "R",
    multiplier: 19.2,
    locale: "en-ZA",
    countries: ["ZA", "South Africa"]
  },
  "INR": {
    currency: "INR",
    symbol: "₹",
    multiplier: 83.5,
    locale: "en-IN",
    countries: ["IN", "India"]
  },
  "AUD": {
    currency: "AUD",
    symbol: "A$",
    multiplier: 1.52,
    locale: "en-AU",
    countries: ["AU", "Australia", "NZ", "New Zealand"]
  },
  "AED": {
    currency: "AED",
    symbol: "د.إ",
    multiplier: 3.67,
    locale: "ar-AE",
    countries: ["AE", "United Arab Emirates", "SA", "Saudi Arabia", "QA", "Qatar", "BH", "Kuwait", "OM", "Oman"]
  },
};

export interface LocationData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
}

export interface PricingInfo {
  basePriceUSD: number;
  localPrice: number;
  currency: string;
  symbol: string;
  locale: string;
}

export function useLocationPricing() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try multiple geolocation services for reliability
      const services = [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/',
        'https://api.ipgeolocation.io/ipgeo?apiKey=free'
      ];

      let locationData: LocationData | null = null;

      for (const service of services) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(service, { 
            signal: controller.signal 
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            locationData = {
              country: data.country_name || data.country || '',
              countryCode: data.country_code || data.countryCode || data.country || '',
              region: data.region || data.region_name || '',
              city: data.city || '',
            };
            if (locationData.countryCode) break;
          }
        } catch (e) {
          continue;
        }
      }

      if (locationData && locationData.countryCode) {
        setLocation(locationData);
      } else {
        // Default to USD if detection fails
        setLocation({
          country: "United States",
          countryCode: "US",
          region: "",
          city: ""
        });
      }
    } catch (err) {
      setError('Failed to detect location');
      // Default to USD on error
      setLocation({
        country: "United States",
        countryCode: "US",
        region: "",
        city: ""
      });
    } finally {
      setLoading(false);
    }
  };

  const getPricingForCourse = (courseTitle: string): PricingInfo => {
    const basePriceUSD = BASE_PRICES[courseTitle] || 300;
    
    if (!location) {
      return {
        basePriceUSD,
        localPrice: basePriceUSD,
        currency: "USD",
        symbol: "$",
        locale: "en-US"
      };
    }

    // Find matching regional pricing
    let regionalConfig = REGIONAL_PRICING["USD"]; // Default
    
    for (const [key, config] of Object.entries(REGIONAL_PRICING)) {
      if (config.countries.some(country => 
        country.toLowerCase() === location.countryCode.toLowerCase() ||
        country.toLowerCase() === location.country.toLowerCase()
      )) {
        regionalConfig = config;
        break;
      }
    }

    const localPrice = Math.round(basePriceUSD * regionalConfig.multiplier);

    return {
      basePriceUSD,
      localPrice,
      currency: regionalConfig.currency,
      symbol: regionalConfig.symbol,
      locale: regionalConfig.locale
    };
  };

  const formatPrice = (courseTitle: string): string => {
    const pricing = getPricingForCourse(courseTitle);
    
    return new Intl.NumberFormat(pricing.locale, {
      style: 'currency',
      currency: pricing.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pricing.localPrice);
  };

  return {
    location,
    loading,
    error,
    getPricingForCourse,
    formatPrice,
    detectLocation
  };
}