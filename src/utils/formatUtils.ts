/**
 * Utility functions per la formattazione di testi e numeri
 */

export const formatCurrency = (
  amount: number,
  currency = 'EUR',
  locale = 'it-IT'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (
  number: number,
  locale = 'it-IT',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(number);
};

export const formatPercentage = (
  value: number,
  locale = 'it-IT',
  decimals = 1
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length).trim() + suffix;
};

export const truncateWords = (text: string, maxWords: number, suffix = '...'): string => {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + suffix;
};

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export const formatPhoneNumber = (phone: string): string => {
  // Formatta numero italiano
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('39')) {
    // Con prefisso internazionale
    const number = cleanPhone.substring(2);
    if (number.length === 10) {
      return `+39 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  } else if (cleanPhone.length === 10) {
    // Numero italiano senza prefisso
    return `${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
  }
  
  return phone; // Restituisce originale se non riconosciuto
};

export const formatTaxCode = (taxCode: string): string => {
  const clean = taxCode.toUpperCase().replace(/\s/g, '');
  if (clean.length === 16) {
    return `${clean.substring(0, 6)} ${clean.substring(6, 8)} ${clean.substring(8, 9)} ${clean.substring(9, 11)} ${clean.substring(11, 12)} ${clean.substring(12, 15)} ${clean.substring(15)}`;
  }
  return taxCode;
};

export const formatVAT = (vat: string): string => {
  const clean = vat.replace(/\D/g, '');
  if (clean.length === 11) {
    return `${clean.substring(0, 5)} ${clean.substring(5, 8)} ${clean.substring(8)}`;
  }
  return vat;
};

export const formatAddress = (address: {
  street?: string;
  number?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  country?: string;
}): string => {
  const parts: string[] = [];
  
  if (address.street) {
    let streetPart = address.street;
    if (address.number) {
      streetPart += ` ${address.number}`;
    }
    parts.push(streetPart);
  }
  
  if (address.city) {
    let cityPart = '';
    if (address.postalCode) {
      cityPart += `${address.postalCode} `;
    }
    cityPart += address.city;
    if (address.province) {
      cityPart += ` (${address.province})`;
    }
    parts.push(cityPart);
  }
  
  if (address.country && address.country.toLowerCase() !== 'italia') {
    parts.push(address.country);
  }
  
  return parts.join(', ');
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

export const generateInitials = (name: string, maxLength = 2): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('');
};

export const generateExcerpt = (text: string, maxLength = 160): string => {
  const stripped = stripHtml(text);
  
  if (stripped.length <= maxLength) return stripped;
  
  // Trova l'ultimo spazio prima del limite
  const lastSpace = stripped.lastIndexOf(' ', maxLength);
  const cutPoint = lastSpace > 0 ? lastSpace : maxLength;
  
  return stripped.substring(0, cutPoint).trim() + '...';
};

export const formatSearchQuery = (query: string): string => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // Rimuove caratteri speciali
    .replace(/\s+/g, ' '); // Normalizza spazi
};

export const highlightText = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const formatPriceRange = (min: number, max?: number, currency = 'EUR'): string => {
  const formattedMin = formatCurrency(min, currency);
  
  if (!max || min === max) {
    return formattedMin;
  }
  
  const formattedMax = formatCurrency(max, currency);
  return `${formattedMin} - ${formattedMax}`;
};

export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return `${count} ${singular}`;
  
  if (plural) return `${count} ${plural}`;
  
  // Regole di pluralizzazione italiana di base
  if (singular.endsWith('a')) {
    return `${count} ${singular.slice(0, -1)}e`;
  }
  
  if (singular.endsWith('e')) {
    return `${count} ${singular.slice(0, -1)}i`;
  }
  
  if (singular.endsWith('o')) {
    return `${count} ${singular.slice(0, -1)}i`;
  }
  
  return `${count} ${singular}`;
};

export const formatList = (items: string[], conjunction = 'e'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const allButLast = items.slice(0, -1);
  const last = items[items.length - 1];
  
  return `${allButLast.join(', ')} ${conjunction} ${last}`;
};

export const maskString = (str: string, visibleChars = 4, maskChar = '*'): string => {
  if (str.length <= visibleChars) return str;
  
  const visible = str.substring(0, visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  
  return visible + masked;
};

export const formatOrdinal = (num: number): string => {
  // Numeri ordinali italiani
  const ordinals: { [key: number]: string } = {
    1: '1°',
    2: '2°',
    3: '3°',
    4: '4°',
    5: '5°',
    6: '6°',
    7: '7°',
    8: '8°',
    9: '9°',
    10: '10°',
  };
  
  return ordinals[num] || `${num}°`;
};