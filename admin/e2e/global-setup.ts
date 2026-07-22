import * as admin from 'firebase-admin';

async function globalSetup() {
  // Point Firebase Admin to the local emulators
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: 'demo-tiny-cms' });
  }

  try {
    // Create the test user automatically before tests run
    await admin.auth().createUser({
      email: 'admin@test.com',
      password: 'password123',
    });
    console.log('✅ E2E global setup: Test user created successfully in emulator.');
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log('✅ E2E global setup: Test user already exists.');
    } else {
      console.error('❌ E2E global setup: Error creating test user:', error);
    }
  }
}

export default globalSetup;
