"use client"

import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAnalytics } from "firebase/analytics"

//TODO: check if this need to be hardcoded in here.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let analytics
const app = initializeApp(firebaseConfig)
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export const database = getDatabase(app)
export const analytic = analytics
