# CMS Architecture Overview

## Tech Stack
- **Framework:** Laravel 12.x
- **Admin Panel:** Filament PHP 3.3
- **Database:** Relational Database (Migrations included for Users, Posts, Sites, Categories, etc.)
- **Storage:** Azure Blob Storage (Configured for publishing JSON and HTML pages)
- **Authentication:** Azure Entra ID (`EntraAuthService`, `EntraAuthController`) alongside standard Laravel Auth.

## Core Architectural Concepts

### Multi-Tenancy / Multi-Site Support
The application is designed to support multiple sites from a single CMS instance.
- The `Site` model represents a tenant/site.
- Features like Posts, Pages, Categories, and Tags are scoped to a `Site`.
- Multi-language support per site (`language_code` is present in Posts, Sites, and SitePublications).

### Static Site Generation / Headless Approach
Instead of serving HTML directly for user requests, the CMS publishes its data and rendered pages to Azure Blob Storage:
- **Site Data (`SitePublisherService`):** Aggregates Posts, Pages, Categories, and Site stats, and publishes a `site-data.json` to Azure.
- **Pages (`PagePublisherService`):** Renders dynamic PageBuilder content into static HTML files and uploads them to Azure.

### Page Builder
The system includes a custom PageBuilder (`use_page_builder`, `page_builder_content` in `Post` and `Page` models). 
- Structured as Sections, Columns, and Elements (Text, Image, Video).
- The `PageRendererService` translates the JSON layout into an HTML fragment.

### Media Handling
- Handled by `FileHandlerService` and `StorageService`.
- Media and images are moved to Azure Blob Storage.
- Special handling for moving Filament's temporary livewire images to permanent Blob paths.
