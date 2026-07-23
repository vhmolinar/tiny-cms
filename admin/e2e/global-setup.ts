import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

async function globalSetup() {
  // Point Firebase Admin to the local emulators
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  
  let app;
  if (getApps().length === 0) {
    app = initializeApp({ projectId: 'cms-gf-udi' });
  } else {
    app = getApps()[0];
  }

  // Clear Firestore to ensure a completely fresh state for onboarding flow
  try {
    await fetch('http://127.0.0.1:8080/emulator/v1/projects/cms-gf-udi/databases/(default)/documents', { method: 'DELETE' });
    console.log('✅ E2E global setup: Firestore emulator state cleared.');
  } catch (error) {
    console.error('⚠️ E2E global setup: Failed to clear Firestore state', error);
  }

  let retries = 5;
  while (retries > 0) {
    try {
      // Create the test user automatically before tests run
      await getAuth(app).createUser({
        email: 'admin@test.com',
        password: 'password123',
      });
      console.log('✅ E2E global setup: Test user created successfully in emulator.');
      break;
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log('✅ E2E global setup: Test user already exists.');
        break;
      }
      if (error.code === 'app/network-error' || error.message.includes('ECONNREFUSED')) {
        console.log(`⏳ Waiting for auth emulator... (${retries} retries left)`);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      console.error('❌ E2E global setup: Error creating test user:', error);
      break;
    }
  }
}

export default globalSetup;
