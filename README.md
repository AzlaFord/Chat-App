# Chat-App

## Descriere proiect  
Chat-App este o aplicație web de chat în timp real care permite utilizatorilor să se autentifice, să creeze și să participe în conversații private. Mesajele sunt transmise instantaneu folosind WebSocket (Socket.IO), iar datele utilizatorilor și mesajele sunt stocate într-o bază de date MongoDB.  

## Funcționalități principale  
- Autentificare și înregistrare utilizatori (login/signup)  
- Creare și vizualizare conversații  
- Trimiterea și primirea mesajelor în timp real între utilizatori  
- Salvarea istoricului mesajelor în baza de date  
- UI React modern și responsive  

## Tehnologii folosite  
- Frontend: React, React Router  
- Backend: Node.js, Express  
- Comunicare în timp real: Socket.IO  
- Baza de date: MongoDB (cu Mongoose)  
- Autentificare: JSON Web Tokens (JWT)  

## Structura proiectului  
Chat-App/
│
├── client/ # Frontend React
│ ├── src/ # Cod sursă React
│ ├── public/ # Resurse statice
│ └── package.json # Dependințe frontend
│
├── server/ # Backend Node.js + Express
│ ├── models/ # Modele MongoDB (Mongoose)
│ ├── routes/ # Rute API
│ ├── controllers/ # Logica rute
│ ├── index.js # Pornirea server-ului
│ └── package.json # Dependințe backend
│
├── .env.example # Variabile mediu
└── README.md # Documentație (aici)

## Instalare și rulare locală  

1. Clonează repo-ul:  
```bash
git clone https://github.com/AzlaFord/Chat-App.git
cd Chat-App
Configurează variabilele de mediu:

Creează un fișier .env în folderul server și setează variabilele necesare (de ex: conexiunea la MongoDB, secret JWT, port) conform .env.example

Instalează dependențele backend și frontend:

npm start
Cum funcționează aplicația

Utilizatorii se pot înregistra și autentifica

După login, utilizatorii pot vedea lista conversațiilor

Se pot crea conversații noi sau intra în cele existente

Mesajele trimise sunt transmise prin Socket.IO și afișate în timp real

Mesajele sunt salvate în MongoDB pentru istoric

Cum contribui

Dacă vrei să contribui:

Fork repo-ul

Creează un branch nou pentru funcționalitatea ta

Fă modificările necesare și testează local

Deschide un Pull Request cu o descriere clară a schimbărilor

## Structura codului (detaliat)

### Backend (`server/`)
- `index.js` — punctul de intrare al serverului, configurarea Express și Socket.IO, conexiunea la MongoDB, pornirea serverului
- `models/` — modele Mongoose pentru utilizatori, mesaje, conversații
- `routes/` — rutele API pentru autentificare, gestionarea conversațiilor și mesajelor
- `controllers/` — logica aferentă rutelor, cum ar fi crearea unui utilizator sau salvarea unui mesaj
- `middleware/` (dacă există) — middleware pentru autentificare JWT și alte verificări

### Frontend (`client/`)
- `src/components/` — componente React pentru UI (Login, Chat, Lista conversațiilor etc)
- `src/context/` (dacă există) — context React pentru starea globală (ex: utilizatorul autentificat, mesajele)
- `src/utils/` — funcții utile, api calls etc
- `src/App.js` — componenta principală care gestionează rutele și logica aplicației
---

