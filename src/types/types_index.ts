// Tipo per gli utenti
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin: Date;
}

// Tipo per gli eventi
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
  categoria: 'corporate' | 'privato' | 'matrimonio' | 'compleanno' | 'altro';
  prezzo?: {
    da: number;
    a?: number;
    valuta: string;
  };
  maxPartecipanti?: number;
  caratteristiche: string[]; // es: ["DJ Set", "Catering", "Fotografia"]
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
  categoria: 'eventi' | 'matrimoni' | 'corporate' | 'party' | 'altro';
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
      linkedin?: string;
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
    linkedin?: string;
  };
}

// Tipo per le statistiche analytics
export interface Analytics {
  id: string;
  tipo: 'page_view' | 'event_view' | 'gallery_view' | 'contact_form';
  data: Date;
  pagina?: string;
  eventoId?: string;
  galleriaId?: string;
  userAgent?: string;
  ip?: string;
  metadata?: Record<string, any>;
}

// Tipo per i form di contatto
export interface ContactForm {
  id: string;
  nome: string;
  email: string;
  telefono?: string;
  messaggio: string;
  tipoEvento?: string;
  dataEvento?: Date;
  budget?: number;
  status: 'nuovo' | 'letto' | 'risposto' | 'chiuso';
  createdAt: Date;
  updatedAt: Date;
  risposte?: {
    messaggio: string;
    data: Date;
    adminId: string;
  }[];
}

// Tipi per l'upload di file
export interface FileUpload {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

// Tipi per le operazioni CRUD
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

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

// Tipo per le notifiche
export interface Notification {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titolo: string;
  messaggio: string;
  autoHide?: boolean;
  duration?: number;
}