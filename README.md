# 🎯 BLEND - Event Management Platform

![BLEND Logo](public/logo-blend.svg)

**BLEND** è una piattaforma web professionale per la gestione e presentazione di eventi esclusivi. Sviluppata con React, TypeScript e Firebase, offre un'esperienza utente moderna e un pannello di amministrazione completo.

## 🌟 Caratteristiche Principali

### 🎨 Frontend Moderno
- **Design Responsivo**: Perfetto su desktop, tablet e mobile
- **Animazioni Avanzate**: Effetti sci-fi e transizioni fluide
- **Performance Ottimizzate**: Caricamento veloce e user experience premium
- **SEO Friendly**: Meta tag ottimizzati e structured data

### 🔐 Pannello Admin Sicuro
- **Autenticazione Firebase**: Sistema di login sicuro
- **Gestione Eventi**: CRUD completo per eventi
- **Gestione Galleria**: Upload e organizzazione media
- **Dashboard Analytics**: Statistiche in tempo reale
- **Controllo Pubblicazione**: Gestione visibilità contenuti

### 📱 Sezioni Pubbliche
- **Homepage**: Landing page con effetti visivi spettacolari
- **Eventi**: Catalogo eventi con filtri e categorie
- **Galleria**: Showcase fotografico in stile masonry
- **Chi Siamo**: Presentazione aziendale professionale

### 🚀 Tecnologie All-in-One
- **React 19** + **TypeScript**: Frontend type-safe e performante
- **Firebase**: Database, Storage, Authentication e Hosting
- **Styled Components**: CSS-in-JS con tema dinamico
- **React Router**: Navigazione SPA ottimizzata

## 📋 Prerequisiti

- **Node.js** (versione 16 o superiore)
- **npm** o **yarn**
- **Account Firebase** (piano Blaze raccomandato per produzione)
- **Git** per il controllo versione

## 🛠️ Installazione

### 1. Clone del Repository
```bash
git clone https://github.com/your-username/blend-website.git
cd blend-website
```

### 2. Installazione Dipendenze
```bash
npm install
# oppure
yarn install
```

### 3. Configurazione Firebase

#### Crea un nuovo progetto Firebase:
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca "Crea progetto"
3. Abilita Authentication, Firestore e Storage

#### Configura Authentication:
- Vai su Authentication > Sign-in method
- Abilita "Email/Password"

#### Configura Firestore:
- Vai su Firestore Database
- Crea database in modalità test
- Sostituisci le regole con quelle in `firestore.rules`

#### Configura Storage:
- Vai su Storage
- Inizializza Storage
- Sostituisci le regole con quelle in `storage.rules`

### 4. Variabili di Ambiente
```bash
# Copia il file di esempio
cp .env.example .env

# Modifica .env con i tuoi dati Firebase
# Puoi trovare questi valori in Firebase Console > Impostazioni progetto
```

**File `.env`:**
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy delle Regole Firebase
```bash
# Installa Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inizializza il progetto
firebase init

# Deploy delle regole
npm run deploy:rules
```

## 🚀 Avvio Sviluppo

```bash
# Avvia il server di sviluppo
npm start

# L'app sarà disponibile su http://localhost:3000
```

## 👨‍💼 Primo Accesso Admin

### Creare il Primo Admin:
1. Registra un utente tramite Firebase Console:
   - Vai su Authentication > Users
   - Clicca "Add user"
   - Inserisci email e password

2. Imposta l'utente come admin:
   - Vai su Firestore Database
   - Crea una collezione `users`
   - Aggiungi un documento con ID = UID dell'utente
   - Struttura documento:
   ```json
   {
     "email": "admin@blend.com",
     "displayName": "Admin",
     "isAdmin": true,
     "createdAt": "2025-01-15T10:00:00Z",
     "lastLogin": "2025-01-15T10:00:00Z"
   }
   ```

3. Accedi al pannello admin:
   - Vai su `/admin/login`
   - Usa le credenziali create

## 🏗️ Struttura Progetto

```
blend-website/
├── public/                 # Asset statici
├── src/
│   ├── components/        # Componenti React
│   │   ├── admin/        # Pannello amministrazione
│   │   ├── common/       # Componenti riutilizzabili
│   │   └── pages/        # Pagine pubbliche
│   ├── contexts/         # React Context (Auth, etc.)
│   ├── services/         # Servizi Firebase
│   ├── types/           # Definizioni TypeScript
│   ├── utils/           # Utility functions
│   └── hooks/           # Custom React hooks
├── firestore.rules       # Regole database
├── storage.rules        # Regole storage
└── firebase.json        # Configurazione Firebase
```

## 🎯 Gestione Contenuti

### Eventi
- **Categorie**: Corporate, Privato, Matrimonio, Compleanno, Altro
- **Media**: Upload multiplo immagini/video
- **Localizzazione**: Nome venue, indirizzo, coordinate
- **Pubblicazione**: Controllo visibilità e evidenza
- **Prezzi**: Range prezzi opzionale

### Galleria
- **Organizzazione**: Per categoria e tag
- **Collegamento**: Link opzionale agli eventi
- **Layout**: Griglia masonry responsiva
- **Filtri**: Per categoria, data, tag

## 🚀 Deploy in Produzione

### Build Ottimizzata
```bash
# Crea build di produzione
npm run build

# Analizza bundle size (opzionale)
npm run analyze
```

### Deploy su Firebase Hosting
```bash
# Deploy completo (hosting + regole)
npm run deploy

# Solo hosting
npm run deploy:hosting

# Solo regole database/storage
npm run deploy:rules
```

### Deploy su Vercel/Netlify
1. Connetti il repository GitHub
2. Imposta le variabili d'ambiente
3. Comando build: `npm run build`
4. Directory output: `build`

## 🔧 Configurazioni Avanzate

### Personalizzazione Tema
```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#4682b4',
    secondary: '#87ceeb',
    background: '#000000',
    // ...
  }
};
```

### Aggiungere Nuove Categorie
```typescript
// src/types/index.ts
export type EventCategory = 
  | 'corporate' 
  | 'privato' 
  | 'matrimonio' 
  | 'compleanno'
  | 'nuova_categoria'; // Aggiungi qui
```

### Custom Analytics
```typescript
// src/services/analyticsService.ts
export const trackEvent = (eventName: string, parameters: any) => {
  // Implementa tracking personalizzato
};
```

## 🛡️ Sicurezza

### Regole Firestore
Le regole in `firestore.rules` garantiscono:
- Lettura pubblica solo contenuti pubblicati
- Scrittura solo per admin autenticati
- Isolamento dati per security

### Regole Storage
Le regole in `storage.rules` garantiscono:
- Lettura pubblica per assets
- Upload solo per admin
- Validazione tipi file

### Best Practices
- Sempre validare input utente
- Non esporre API keys sensibili
- Usare HTTPS in produzione
- Backup regolari database

## 📊 Monitoraggio

### Firebase Analytics
- Tracking automatico page views
- Eventi personalizzati
- Audience insights

### Performance Monitoring
```bash
# Analisi performance
npm run analyze

# Test lighthouse
npx lighthouse http://localhost:3000 --view
```

## 🤝 Contribuire

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/nuova-funzionalita`)
3. Commit delle modifiche (`git commit -m 'Aggiunge nuova funzionalità'`)
4. Push del branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🆘 Supporto

### Problemi Comuni

**Build Error - Firebase Config:**
```bash
# Verifica che tutte le variabili .env siano impostate
npm run type-check
```

**Auth Error - User not Admin:**
```bash
# Verifica documento utente in Firestore
# Assicurati che isAdmin: true
```

**Upload Error - Storage Rules:**
```bash
# Verifica regole storage.rules
# Deploy regole: npm run deploy:rules
```

### Contatti
- **Email**: support@blend-eventi.com
- **GitHub Issues**: [Apri un issue](https://github.com/your-username/blend-website/issues)
- **Documentazione**: [Wiki del progetto](https://github.com/your-username/blend-website/wiki)

---

**Sviluppato con ❤️ per eventi indimenticabili**