# Core Services & Business Logic

The CMS encapsulates its complex business logic inside service classes located in `app/Services`.

## `SitePublisherService`
**Purpose:** Aggregates a site's content and publishes it as a static JSON file to Azure Blob Storage.
- **Key Methods:**
  - `publishSite(Site $site)`: Gathers posts, pages, categories, feed pages, generates a massive `site-data.json`, uploads to Azure, and creates a `SitePublication` record.
  - `generateSiteData()`: Structures the JSON payload.
  - `canPublishSite()`: Validates if a site is ready for publishing (e.g., must have active categories and posts).
  - `republishAllLanguages()`: Utility to republish all language variations of a site.

## `PagePublisherService`
**Purpose:** Handles publishing of custom PageBuilder pages.
- **Key Methods:**
  - `publish(Page $page)`: Parses the JSON layout of a page, strictly traverses it to find image elements, uploads local temporary images to Azure, renders the layout into an HTML fragment via `PageRendererService`, wraps it in a Blade template, and uploads the `.html` file to Azure Blob Storage.

## `FileHandlerService`
**Purpose:** Manages file uploads, particularly moving temporary images from Filament (Livewire) to persistent Azure Blob Storage.
- **Key Methods:**
  - `handleFeaturedImageWithContext()`: Processes featured images for posts, moving them to structured blob paths (e.g., `sites/{slug}/{lang}/posts/{id}/destaque/`).
  - `processAndUploadImagesInContent()`: Scans rich-text content for temporary image paths, uploads them to Azure, and updates the `src` attributes in the HTML.
  - `cleanupContentImages()`: Deletes images from Azure when their associated content is deleted.

## `EntraAuthService`
Manages Azure Entra ID (Active Directory) SSO authentication integration for the admin panel.

## `StorageService`
A wrapper around Laravel's `Storage` facade, configured to interact heavily with the `azure` disk for Blob Storage operations.
