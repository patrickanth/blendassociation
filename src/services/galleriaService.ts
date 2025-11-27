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
import { GalleriaItem } from '../types';

// Cache in memoria per ridurre chiamate al DB
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

class GalleriaService {
  private readonly collectionName = 'galleria';

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

  // Ottieni elementi galleria pubblici (con cache)
  async getGalleriaPubblica(): Promise<GalleriaItem[]> {
    const cacheKey = 'galleria-pubblica';
    
    // Controlla cache
    const cached = this.getCached<GalleriaItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const galleriaRef = collection(db, this.collectionName);
      const q = query(
        galleriaRef,
        where('pubblicato', '==', true),
        orderBy('data', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const items: GalleriaItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          data: data.data?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as GalleriaItem);
      });

      // Salva in cache
      this.setCache(cacheKey, items);
      return items;

    } catch (error) {
      console.error('Errore caricamento galleria:', error);
      return [];
    }
  }

  // Ottieni tutti gli elementi (solo admin)
  async getGalleriaAdmin(): Promise<GalleriaItem[]> {
    try {
      const galleriaRef = collection(db, this.collectionName);
      const q = query(galleriaRef, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const items: GalleriaItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          data: data.data?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as GalleriaItem);
      });

      return items;

    } catch (error) {
      console.error('Errore caricamento galleria admin:', error);
      return [];
    }
  }

  // Ottieni elementi per categoria
  async getGalleriaByCategoria(categoria: string): Promise<GalleriaItem[]> {
    const cacheKey = `galleria-cat-${categoria}`;
    
    // Controlla cache
    const cached = this.getCached<GalleriaItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const galleriaRef = collection(db, this.collectionName);
      const q = query(
        galleriaRef,
        where('pubblicato', '==', true),
        where('categoria', '==', categoria),
        orderBy('data', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const items: GalleriaItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          data: data.data?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as GalleriaItem);
      });

      // Salva in cache
      this.setCache(cacheKey, items);
      return items;

    } catch (error) {
      console.error(`Errore caricamento galleria categoria ${categoria}:`, error);
      return [];
    }
  }

  // Crea nuovo elemento
  async createGalleriaItem(item: Omit<GalleriaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const itemData = {
        ...item,
        data: Timestamp.fromDate(item.data),
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, this.collectionName), itemData);
      
      // Pulisci cache
      this.clearCache();
      
      return docRef.id;
    } catch (error) {
      console.error('Errore creazione elemento galleria:', error);
      throw error;
    }
  }

  // Aggiorna elemento
  async updateGalleriaItem(id: string, updates: Partial<GalleriaItem>): Promise<void> {
    try {
      const itemRef = doc(db, this.collectionName, id);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.data) {
        updateData.data = Timestamp.fromDate(updates.data);
      }

      await updateDoc(itemRef, updateData);
      
      // Pulisci cache
      this.clearCache();
    } catch (error) {
      console.error('Errore aggiornamento elemento galleria:', error);
      throw error;
    }
  }

  // Elimina elemento
  async deleteGalleriaItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
      
      // Pulisci cache
      this.clearCache();
    } catch (error) {
      console.error('Errore eliminazione elemento galleria:', error);
      throw error;
    }
  }

  // Elementi in evidenza per homepage
  async getGalleriaInEvidenza(limite = 6): Promise<GalleriaItem[]> {
    const cacheKey = `galleria-evidenza-${limite}`;
    
    // Controlla cache
    const cached = this.getCached<GalleriaItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const galleriaRef = collection(db, this.collectionName);
      const q = query(
        galleriaRef,
        where('pubblicato', '==', true),
        where('inEvidenza', '==', true),
        orderBy('data', 'desc'),
        limit(limite)
      );

      const snapshot = await getDocs(q);
      const items: GalleriaItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          data: data.data?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as GalleriaItem);
      });

      // Salva in cache
      this.setCache(cacheKey, items);
      return items;

    } catch (error) {
      console.error('Errore caricamento galleria in evidenza:', error);
      return [];
    }
  }
}

export const galleriaService = new GalleriaService();