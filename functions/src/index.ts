import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  storageBucket: "cms-gf-udi.firebasestorage.app"
});

export const publishSite = functions.https.onCall(async (data, context) => {
  // Require auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can publish the site."
    );
  }

  const { siteId } = data;
  if (!siteId) {
    throw new functions.https.HttpsError("invalid-argument", "The siteId is required.");
  }

  try {
    const db = admin.firestore();
    const storage = admin.storage();
    const bucket = storage.bucket();

    // Verify site exists and user owns it
    const siteDoc = await db.collection("sites").doc(siteId).get();
    if (!siteDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Site not found.");
    }
    const siteDataInfo = siteDoc.data();
    if (siteDataInfo?.ownerId !== context.auth.uid) {
      throw new functions.https.HttpsError("permission-denied", "You do not own this site.");
    }

    const siteData = {
      siteName: siteDataInfo?.name || "Tiny CMS Site",
      publishedAt: new Date().toISOString(),
      message: "Hello from Tiny CMS!",
      posts: [],
      categories: []
    };

    const file = bucket.file(`sites/${siteId}/site-data.json`);
    await file.save(JSON.stringify(siteData, null, 2), {
      contentType: "application/json"
    });

    return { success: true, message: "Site published successfully." };
  } catch (error: any) {
    console.error("Error publishing site:", error);
    throw new functions.https.HttpsError("unknown", "Full Error: " + (error.stack || error.toString()));
  }
});
