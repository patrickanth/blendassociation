// Tipo per gli utenti
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin: Date;
}

// Tipo per gli eventi - SOLO TECH EVENTS
export interface Evento {
  id: string;
  titolo: string;
  descrizione: string;
  descrizioneBreve: string;
  data: Date;
  dataFine?: Date;
  location: {
    nome: string;
    indirizzo: string;
    citta: string;
    coordinate?: {
      lat: number;
      lng: number;
    };
  };
  immagini: string[]; // URLs delle immagini
  video?: string[]; // URLs dei video
  categoria: 'deep-tech' | 'tech-house' | 'minimal' | 'afterparty' | 'special';
  lineup?: string[]; // DJ/Artists lineup
  ticketLink?: string; // Link biglietti esterni
  prezzo?: {
    da: number;
    a?: number;
    valuta: string;
  };
  maxPartecipanti?: number;
  caratteristiche: string[]; // es: ["Sound System Funktion One", "Visual Show", "Open Air"]
  pubblicato: boolean;
  inEvidenza: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // UID dell'admin che ha creato l'evento
}

// Tipo per gli elementi della galleria
export interface GalleriaItem {
  id: string;
  titolo: string;
  descrizione?: string;
  immagini: string[];
  video?: string[];
  categoria: 'events' | 'venue' | 'crowd' | 'artists' | 'backstage';
  tags: string[]; // per facilitare la ricerca
  data: Date;
  pubblicato: boolean;
  inEvidenza: boolean;
  eventoId?: string; // collegamento opzionale ad un evento
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Tipo per le configurazioni del sito
export interface SiteConfig {
  id: string;
  chiSiamo: {
    titolo: string;
    descrizione: string;
    storia: string;
    valori: string[];
    team: TeamMember[];
  };
  contatti: {
    telefono: string;
    email: string;
    indirizzo: string;
    socialMedia: {
      instagram?: string;
      facebook?: string;
      soundcloud?: string;
      youtube?: string;
    };
  };
  seo: {
    titolo: string;
    descrizione: string;
    keywords: string[];
  };
  updatedAt: Date;
  updatedBy: string;
}

// Tipo per i membri del team
export interface TeamMember {
  id: string;
  nome: string;
  ruolo: string;
  descrizione: string;
  immagine?: string;
  social?: {
    instagram?: string;
    soundcloud?: string;
  };
}

// Tipo per le notifiche
export interface Notification {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titolo: string;
  messaggio: string;
  autoHide?: boolean;
  duration?: number;
}

// Tipi per l'upload di file
export interface FileUpload {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

// Tipo per i filtri degli eventi
export interface EventoFilters {
  categoria?: string;
  dataInizio?: Date;
  dataFine?: Date;
  location?: string;
  solo_pubblicati?: boolean;
  solo_in_evidenza?: boolean;
}

// Tipo per i filtri della galleria
export interface GalleriaFilters {
  categoria?: string;
  dataInizio?: Date;
  dataFine?: Date;
  tags?: string[];
  solo_pubblicati?: boolean;
  solo_in_evidenza?: boolean;
}