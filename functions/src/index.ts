import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  storageBucket: "demo-tiny-cms.appspot.com"
});

export const publishSite = functions.https.onCall(async (data, context) => {
  // Require auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can publish the site."
    );
  }

  try {
    const storage = admin.storage();
    const bucket = storage.bucket();

    // For the MVP, we just create a placeholder JSON
    // We will expand this to fetch data from Firestore soon
    const siteData = {
      publishedAt: new Date().toISOString(),
      message: "Hello from Tiny CMS!",
      posts: [],
      categories: []
    };

    const file = bucket.file("site-data.json");
    await file.save(JSON.stringify(siteData, null, 2), {
      contentType: "application/json"
    });

    return { success: true, message: "Site published successfully." };
  } catch (error: any) {
    console.error("Error publishing site:", error);
    throw new functions.https.HttpsError("unknown", "Full Error: " + (error.stack || error.toString()));
  }
});
