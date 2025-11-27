import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Evento } from '../types';

// Cache in memoria per ridurre chiamate al DB
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti
const QUERY_TIMEOUT = 10000; // 10 secondi timeout

// Helper per aggiungere timeout alle Promise
function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    )
  ]);
}

class EventiService {
  private readonly collectionName = 'eventi';

  // Helper per gestire la cache
  private getCached<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }
    cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  private clearCache(): void {
    cache.clear();
  }

  // Ottieni eventi pubblici (con cache e timeout)
  async getEventiPubblici(): Promise<Evento[]> {
    const cacheKey = 'eventi-pubblici';

    // Controlla cache
    const cached = this.getCached<Evento[]>(cacheKey);
    if (cached) return cached;

    try {
      const eventiRef = collection(db, this.collectionName);
      const q = query(
        eventiRef,
        where('pubblicato', '==', true),
        orderBy('data', 'desc'),
        limit(50)
      );

      const snapshot = await withTimeout(
        getDocs(q),
        QUERY_TIMEOUT,
        'Timeout caricamento eventi. Verifica che gli indici Firestore siano configurati.'
      );

      const eventi: Evento[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        eventi.push({
          id: doc.id,
          ...data,
          data: data.data?.toDate() || new Date(),
          dataFine: data.dataFine?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Evento);
      });

      // Salva in cache
      this.setCache(cacheKey, eventi);
      return eventi;

    } catch (error: any) {
      // Se è un errore di indice mancante, log specifico
      if (error?.message?.includes('index') || error?.code === 'failed-precondition') {
        console.error('Errore: Indice Firestore mancante. Esegui: firebase deploy --only firestore:indexes');
      } else {
        console.error('Errore caricamento eventi:', error);
      }
      return [];
    }
  }

  // Ottieni tutti gli eventi (solo admin)
  async getEventiAdmin(): Promise<Evento[]> {
    try {
      const eventiRef = collection(db, this.collectionName);
      const q = query(eventiRef, orderBy('createdAt', 'desc'));

      const snapshot = await withTimeout(
        getDocs(q),
        QUERY_TIMEOUT,
        'Timeout caricamento eventi admin.'
      );

      const eventi: Evento[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        eventi.push({
          id: doc.id,
          ...data,
          data: data.data?.toDate() || new Date(),
          dataFine: data.dataFine?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Evento);
      });

      return eventi;

    } catch (error) {
      console.error('Errore caricamento eventi admin:', error);
      return [];
    }
  }

  // Ottieni singolo evento
  async getEvento(id: string): Promise<Evento | null> {
    const cacheKey = `evento-${id}`;

    // Controlla cache
    const cached = this.getCached<Evento>(cacheKey);
    if (cached) return cached;

    try {
      const eventoRef = doc(db, this.collectionName, id);
      const eventoSnap = await withTimeout(
        getDoc(eventoRef),
        QUERY_TIMEOUT,
        'Timeout caricamento evento.'
      );

      if (!eventoSnap.exists()) return null;

      const data = eventoSnap.data();
      const evento: Evento = {
        id: eventoSnap.id,
        ...data,
        data: data.data?.toDate() || new Date(),
        dataFine: data.dataFine?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Evento;

      // Salva in cache
      this.setCache(cacheKey, evento);
      return evento;

    } catch (error) {
      console.error('Errore caricamento evento:', error);
      return null;
    }
  }

  // Crea nuovo evento
  async createEvento(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const eventoData = {
        ...evento,
        data: Timestamp.fromDate(evento.data),
        dataFine: evento.dataFine ? Timestamp.fromDate(evento.dataFine) : null,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, this.collectionName), eventoData);

      // Pulisci cache
      this.clearCache();

      return docRef.id;
    } catch (error) {
      console.error('Errore creazione evento:', error);
      throw error;
    }
  }

  // Aggiorna evento
  async updateEvento(id: string, updates: Partial<Evento>): Promise<void> {
    try {
      const eventoRef = doc(db, this.collectionName, id);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.data) {
        updateData.data = Timestamp.fromDate(updates.data);
      }
      if (updates.dataFine) {
        updateData.dataFine = Timestamp.fromDate(updates.dataFine);
      }

      await updateDoc(eventoRef, updateData);

      // Pulisci cache
      this.clearCache();
    } catch (error) {
      console.error('Errore aggiornamento evento:', error);
      throw error;
    }
  }

  // Elimina evento
  async deleteEvento(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));

      // Pulisci cache
      this.clearCache();
    } catch (error) {
      console.error('Errore eliminazione evento:', error);
      throw error;
    }
  }

  // Eventi in evidenza per homepage
  async getEventiInEvidenza(limite = 3): Promise<Evento[]> {
    const cacheKey = `eventi-evidenza-${limite}`;

    // Controlla cache
    const cached = this.getCached<Evento[]>(cacheKey);
    if (cached) return cached;

    try {
      const eventiRef = collection(db, this.collectionName);
      const q = query(
        eventiRef,
        where('pubblicato', '==', true),
        where('inEvidenza', '==', true),
        orderBy('data', 'desc'),
        limit(limite)
      );

      const snapshot = await withTimeout(
        getDocs(q),
        QUERY_TIMEOUT,
        'Timeout caricamento eventi in evidenza.'
      );

      const eventi: Evento[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        eventi.push({
          id: doc.id,
          ...data,
          data: data.data?.toDate() || new Date(),
          dataFine: data.dataFine?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Evento);
      });

      // Salva in cache
      this.setCache(cacheKey, eventi);
      return eventi;

    } catch (error: any) {
      if (error?.message?.includes('index') || error?.code === 'failed-precondition') {
        console.error('Errore: Indice Firestore mancante per eventi in evidenza.');
      } else {
        console.error('Errore caricamento eventi in evidenza:', error);
      }
      return [];
    }
  }
}

export const eventiService = new EventiService();
