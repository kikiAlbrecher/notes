import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "danotes-e3150", "appId": "1:388708590496:web:eb4e0d21262357a43d3ac5", "storageBucket": "danotes-e3150.firebasestorage.app", "apiKey": "AIzaSyDfYzx0VJAR_0XYm6yMiEXQTpBNDlHhe3I", "authDomain": "danotes-e3150.firebaseapp.com", "messagingSenderId": "388708590496" }))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
