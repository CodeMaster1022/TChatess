// Phone number validation utilities

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  format: string;
}

// Comprehensive country phone validation rules
export const phoneValidationRules: { [key: string]: Country } = {
  'US': {
    name: 'United States',
    code: 'US',
    dialCode: '+1',
    flag: '🇺🇸',
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    format: '(XXX) XXX-XXXX'
  },
  'CA': {
    name: 'Canada',
    code: 'CA',
    dialCode: '+1',
    flag: '🇨🇦',
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    format: '(XXX) XXX-XXXX'
  },
  'IN': {
    name: 'India',
    code: 'IN',
    dialCode: '+91',
    flag: '🇮🇳',
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
    format: 'XXXXX XXXXX'
  },
  'GB': {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    flag: '🇬🇧',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{8,9}$/,
    format: 'XXXX XXX XXXX'
  },
  'AU': {
    name: 'Australia',
    code: 'AU',
    dialCode: '+61',
    flag: '🇦🇺',
    minLength: 9,
    maxLength: 9,
    pattern: /^[2-9]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'DE': {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
    flag: '🇩🇪',
    minLength: 10,
    maxLength: 12,
    pattern: /^[1-9]\d{9,11}$/,
    format: 'XXX XXXXXXX'
  },
  'FR': {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
    flag: '🇫🇷',
    minLength: 10,
    maxLength: 10,
    pattern: /^[1-9]\d{8}$/,
    format: 'XX XX XX XX XX'
  },
  'JP': {
    name: 'Japan',
    code: 'JP',
    dialCode: '+81',
    flag: '🇯🇵',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{9,10}$/,
    format: 'XXX-XXXX-XXXX'
  },
  'CN': {
    name: 'China',
    code: 'CN',
    dialCode: '+86',
    flag: '🇨🇳',
    minLength: 11,
    maxLength: 11,
    pattern: /^1[3-9]\d{9}$/,
    format: 'XXX XXXX XXXX'
  },
  'BR': {
    name: 'Brazil',
    code: 'BR',
    dialCode: '+55',
    flag: '🇧🇷',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{9,10}$/,
    format: '(XX) XXXXX-XXXX'
  },
  'MX': {
    name: 'Mexico',
    code: 'MX',
    dialCode: '+52',
    flag: '🇲🇽',
    minLength: 10,
    maxLength: 10,
    pattern: /^[1-9]\d{9}$/,
    format: 'XXX XXX XXXX'
  },
  'KR': {
    name: 'South Korea',
    code: 'KR',
    dialCode: '+82',
    flag: '🇰🇷',
    minLength: 9,
    maxLength: 10,
    pattern: /^[1-9]\d{8,9}$/,
    format: 'XXX-XXXX-XXXX'
  },
  'IT': {
    name: 'Italy',
    code: 'IT',
    dialCode: '+39',
    flag: '🇮🇹',
    minLength: 9,
    maxLength: 10,
    pattern: /^[0-9]\d{8,9}$/,
    format: 'XXX XXX XXXX'
  },
  'ES': {
    name: 'Spain',
    code: 'ES',
    dialCode: '+34',
    flag: '🇪🇸',
    minLength: 9,
    maxLength: 9,
    pattern: /^[6-9]\d{8}$/,
    format: 'XXX XX XX XX'
  },
  'NL': {
    name: 'Netherlands',
    code: 'NL',
    dialCode: '+31',
    flag: '🇳🇱',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'SE': {
    name: 'Sweden',
    code: 'SE',
    dialCode: '+46',
    flag: '🇸🇪',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'NO': {
    name: 'Norway',
    code: 'NO',
    dialCode: '+47',
    flag: '🇳🇴',
    minLength: 8,
    maxLength: 8,
    pattern: /^[2-9]\d{7}$/,
    format: 'XXXX XXXX'
  },
  'DK': {
    name: 'Denmark',
    code: 'DK',
    dialCode: '+45',
    flag: '🇩🇰',
    minLength: 8,
    maxLength: 8,
    pattern: /^[2-9]\d{7}$/,
    format: 'XX XX XX XX'
  },
  'FI': {
    name: 'Finland',
    code: 'FI',
    dialCode: '+358',
    flag: '🇫🇮',
    minLength: 9,
    maxLength: 10,
    pattern: /^[1-9]\d{8,9}$/,
    format: 'XXX XXX XXXX'
  },
  'CH': {
    name: 'Switzerland',
    code: 'CH',
    dialCode: '+41',
    flag: '🇨🇭',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'AT': {
    name: 'Austria',
    code: 'AT',
    dialCode: '+43',
    flag: '🇦🇹',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{9,10}$/,
    format: 'XXXX XXXXXXX'
  },
  'BE': {
    name: 'Belgium',
    code: 'BE',
    dialCode: '+32',
    flag: '🇧🇪',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    format: 'XXX XX XX XX'
  },
  'IE': {
    name: 'Ireland',
    code: 'IE',
    dialCode: '+353',
    flag: '🇮🇪',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    format: 'XXX XXX XXXX'
  },
  'NZ': {
    name: 'New Zealand',
    code: 'NZ',
    dialCode: '+64',
    flag: '🇳🇿',
    minLength: 9,
    maxLength: 10,
    pattern: /^[2-9]\d{8,9}$/,
    format: 'XXX XXX XXXX'
  },
  'SG': {
    name: 'Singapore',
    code: 'SG',
    dialCode: '+65',
    flag: '🇸🇬',
    minLength: 8,
    maxLength: 8,
    pattern: /^[6-9]\d{7}$/,
    format: 'XXXX XXXX'
  },
  'MY': {
    name: 'Malaysia',
    code: 'MY',
    dialCode: '+60',
    flag: '🇲🇾',
    minLength: 9,
    maxLength: 10,
    pattern: /^[1-9]\d{8,9}$/,
    format: 'XXX-XXX XXXX'
  },
  'TH': {
    name: 'Thailand',
    code: 'TH',
    dialCode: '+66',
    flag: '🇹🇭',
    minLength: 9,
    maxLength: 9,
    pattern: /^[6-9]\d{8}$/,
    format: 'XX XXX XXXX'
  },
  'PH': {
    name: 'Philippines',
    code: 'PH',
    dialCode: '+63',
    flag: '🇵🇭',
    minLength: 10,
    maxLength: 10,
    pattern: /^9\d{9}$/,
    format: 'XXXX XXX XXXX'
  },
  'VN': {
    name: 'Vietnam',
    code: 'VN',
    dialCode: '+84',
    flag: '🇻🇳',
    minLength: 9,
    maxLength: 10,
    pattern: /^[1-9]\d{8,9}$/,
    format: 'XXX XXX XXXX'
  },
  'ID': {
    name: 'Indonesia',
    code: 'ID',
    dialCode: '+62',
    flag: '🇮🇩',
    minLength: 10,
    maxLength: 12,
    pattern: /^8\d{9,11}$/,
    format: 'XXXX-XXXX-XXXX'
  },
  'TR': {
    name: 'Turkey',
    code: 'TR',
    dialCode: '+90',
    flag: '🇹🇷',
    minLength: 10,
    maxLength: 10,
    pattern: /^5\d{9}$/,
    format: 'XXX XXX XX XX'
  },
  'PL': {
    name: 'Poland',
    code: 'PL',
    dialCode: '+48',
    flag: '🇵🇱',
    minLength: 9,
    maxLength: 9,
    pattern: /^[4-9]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'CZ': {
    name: 'Czech Republic',
    code: 'CZ',
    dialCode: '+420',
    flag: '🇨🇿',
    minLength: 9,
    maxLength: 9,
    pattern: /^[2-9]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'HU': {
    name: 'Hungary',
    code: 'HU',
    dialCode: '+36',
    flag: '🇭🇺',
    minLength: 9,
    maxLength: 9,
    pattern: /^[2-9]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'RO': {
    name: 'Romania',
    code: 'RO',
    dialCode: '+40',
    flag: '🇷🇴',
    minLength: 10,
    maxLength: 10,
    pattern: /^7\d{9}$/,
    format: 'XXXX XXX XXX'
  },
  'RU': {
    name: 'Russia',
    code: 'RU',
    dialCode: '+7',
    flag: '🇷🇺',
    minLength: 10,
    maxLength: 10,
    pattern: /^9\d{9}$/,
    format: 'XXX XXX-XX-XX'
  },
  'ZA': {
    name: 'South Africa',
    code: 'ZA',
    dialCode: '+27',
    flag: '🇿🇦',
    minLength: 9,
    maxLength: 9,
    pattern: /^[6-8]\d{8}$/,
    format: 'XXX XXX XXXX'
  },
  'NG': {
    name: 'Nigeria',
    code: 'NG',
    dialCode: '+234',
    flag: '🇳🇬',
    minLength: 10,
    maxLength: 10,
    pattern: /^[7-9]\d{9}$/,
    format: 'XXX XXX XXXX'
  },
  'KE': {
    name: 'Kenya',
    code: 'KE',
    dialCode: '+254',
    flag: '🇰🇪',
    minLength: 9,
    maxLength: 9,
    pattern: /^[7]\d{8}$/,
    format: 'XXX XXX XXX'
  },
  'EG': {
    name: 'Egypt',
    code: 'EG',
    dialCode: '+20',
    flag: '🇪🇬',
    minLength: 10,
    maxLength: 10,
    pattern: /^1\d{9}$/,
    format: 'XXX XXX XXXX'
  },
  'AR': {
    name: 'Argentina',
    code: 'AR',
    dialCode: '+54',
    flag: '🇦🇷',
    minLength: 10,
    maxLength: 10,
    pattern: /^9\d{9}$/,
    format: 'XXXX-XXX-XXXX'
  },
  'CL': {
    name: 'Chile',
    code: 'CL',
    dialCode: '+56',
    flag: '🇨🇱',
    minLength: 9,
    maxLength: 9,
    pattern: /^9\d{8}$/,
    format: 'XXXX XXXX'
  },
  'CO': {
    name: 'Colombia',
    code: 'CO',
    dialCode: '+57',
    flag: '🇨🇴',
    minLength: 10,
    maxLength: 10,
    pattern: /^3\d{9}$/,
    format: 'XXX XXX XXXX'
  },
  'PE': {
    name: 'Peru',
    code: 'PE',
    dialCode: '+51',
    flag: '🇵🇪',
    minLength: 9,
    maxLength: 9,
    pattern: /^9\d{8}$/,
    format: 'XXX XXX XXX'
  }
};

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formattedNumber?: string;
  suggestion?: string;
}

/**
 * Validates a phone number based on the selected country
 */
export function validatePhoneNumber(
  phoneNumber: string, 
  countryCode: string
): PhoneValidationResult {
  // Remove all non-digit characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if phone number is empty
  if (!cleanedNumber) {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  // Get validation rules for the country
  const countryRules = phoneValidationRules[countryCode];
  
  if (!countryRules) {
    // Fallback validation for unsupported countries
    if (cleanedNumber.length < 7 || cleanedNumber.length > 15) {
      return {
        isValid: false,
        error: 'Phone number must be between 7-15 digits'
      };
    }
    
    return {
      isValid: true,
      formattedNumber: cleanedNumber
    };
  }

  // Check length
  if (cleanedNumber.length < countryRules.minLength) {
    return {
      isValid: false,
      error: `Phone number is too short. Expected ${countryRules.minLength} digits for ${countryRules.name}`,
      suggestion: `Format: ${countryRules.format}`
    };
  }

  if (cleanedNumber.length > countryRules.maxLength) {
    return {
      isValid: false,
      error: `Phone number is too long. Expected ${countryRules.maxLength} digits for ${countryRules.name}`,
      suggestion: `Format: ${countryRules.format}`
    };
  }

  // Check pattern
  if (!countryRules.pattern.test(cleanedNumber)) {
    return {
      isValid: false,
      error: `Invalid phone number format for ${countryRules.name}`,
      suggestion: `Expected format: ${countryRules.format}`
    };
  }

  // Format the number
  const formattedNumber = formatPhoneNumber(cleanedNumber, countryCode);

  return {
    isValid: true,
    formattedNumber
  };
}

/**
 * Formats a phone number based on country rules
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const rules = phoneValidationRules[countryCode];
  
  if (!rules || !cleaned) {
    return cleaned;
  }

  switch (countryCode) {
    case 'US':
    case 'CA':
      // Format as (XXX) XXX-XXXX
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      break;
      
    case 'IN':
      // Format as XXXXX XXXXX
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
      }
      break;
      
    case 'GB':
      // Format as XXXX XXX XXXX
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
      } else if (cleaned.length === 11) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
      }
      break;
      
    case 'AU':
      // Format as XXX XXX XXX
      if (cleaned.length === 9) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      }
      break;
      
    case 'DE':
      // Format as XXX XXXXXXX
      if (cleaned.length >= 10) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      }
      break;
      
    case 'FR':
      // Format as XX XX XX XX XX
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
      }
      break;
      
    case 'BR':
      // Format as (XX) XXXXX-XXXX
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
      } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
      }
      break;
      
    case 'MX':
      // Format as XXX XXX XXXX
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      }
      break;
      
    case 'JP':
      // Format as XXX-XXXX-XXXX
      if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
      } else if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      break;
      
    case 'CN':
      // Format as XXX XXXX XXXX
      if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
      }
      break;
      
    case 'SG':
      // Format as XXXX XXXX
      if (cleaned.length === 8) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
      }
      break;
      
    case 'NO':
    case 'DK':
      // Format as XXXX XXXX
      if (cleaned.length === 8) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
      }
      break;
      
    default:
      // Default formatting - add spaces every 3-4 digits
      if (cleaned.length <= 8) {
        return cleaned.replace(/(\d{3,4})(\d{3,4})/, '$1 $2');
      } else {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4,})/, '$1 $2 $3');
      }
  }
  
  return cleaned;
}

/**
 * Gets phone number placeholder based on country
 */
export function getPhoneNumberPlaceholder(countryCode: string): string {
  const rules = phoneValidationRules[countryCode];
  if (!rules) {
    return 'Enter phone number';
  }
  
  return `(${rules.format})`;
}

/**
 * Gets validation info for a country
 */
export function getCountryValidationInfo(countryCode: string): {
  format: string;
  example: string;
  length: string;
} | null {
  const rules = phoneValidationRules[countryCode];
  if (!rules) return null;
  
  return {
    format: rules.format,
    example: rules.format.replace(/X/g, '0'),
    length: rules.minLength === rules.maxLength 
      ? `${rules.minLength} digits`
      : `${rules.minLength}-${rules.maxLength} digits`
  };
}

/**
 * Checks if a country code is supported for validation
 */
export function isCountrySupported(countryCode: string): boolean {
  return countryCode in phoneValidationRules;
}

/**
 * Gets all supported country codes
 */
export function getSupportedCountries(): string[] {
  return Object.keys(phoneValidationRules);
} 