# Database Schema & Models

The CMS employs a robust relational schema tailored for multi-site, multi-language content management.

## Core Models

### `Site`
- **Fields:** `name`, `slug`, `domain`, `description`, `logo_url`, `theme_config`, `seo_config`, `active`, `default_language_code`, `coordinator_id`.
- **Relations:** 
  - `HasMany`: `categories`, `userSiteRoles`, `publications`, `pages`, `apiKeys`.
  - `BelongsToMany`: `users` (via `user_site_roles`).

### `Post`
- **Fields:** `title`, `slug`, `content`, `excerpt`, `user_id`, `language_code`, `published_url`, `featured_image`, `published_at`, `meta_tags`, `active`, `is_featured`, `is_hero`, `is_slide`, `featured_order`, `slide_order`, `page_builder_content`, `use_page_builder`, `show_footer`.
- **Relations:** 
  - `BelongsTo`: `author` (`User`).
  - `BelongsToMany`: `categories`, `tags`.
- **Scopes:** `active`, `published`, `scheduled`, `draft`, `forSite`, `inCategory`, `withTag`, `byAuthor`, `featured`, `hero`, `slides`.

### `Category`
- **Relations:** Belongs to a `Site`, has many `Posts`. Supports hierarchy and ordering.

### `SitePublication`
Tracks the history and status of site deployments to Azure Blob Storage.
- **Fields:** `site_id`, `published_by`, `file_path`, `public_url`, `publication_data` (JSON snapshot), `stats`, `status` (active, archived, failed), `notes`, `language_code`, `published_at`.

### `User` & `UserSiteRole`
- Manages access control. Users can be assigned specific roles on specific sites (Coordinator, Editor, etc.).

## Migrations Highlight
Key migrations establish the foundation:
- `2025_09_08_195245_create_sites_table.php`
- `2025_06_15_230313_create_posts_table.php`
- `2025_09_11_204956_create_site_publications_table.php`
- `2026_03_16_230000_add_entra_fields_to_users_table.php`
