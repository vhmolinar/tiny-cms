# API Endpoints

The API is primarily read-only, serving data to the frontend or external consumers, while writes happen through the Filament Admin Panel.

## Web Routes (`routes/web.php`)
- **`/admin`**: Redirects from root to the Filament admin panel.
- **Entra Authentication**: 
  - `/admin/auth/entra/redirect`
  - `/admin/auth/entra/callback`
- **Temporary Storage**: `/storage/temp/{path}` - Servers temporary local files before they are pushed to Azure.

## API Routes (`routes/api.php`)

All API routes are prefixed with `/api/v1`.

### Public Routes
- `GET /health`: Health check, returns status and timestamp.
- `GET /site-data`: Returns the URL of the published JSON for a specific site. 
  - Parameters: `slug`, `language`.

### Protected Routes (Require API Key Middleware: `api.key.auth`)
- `GET /warmup`: Used during deployment to warm up the database.
- `GET /site`: Returns basic site info.
- `GET /posts`: Paginated list of posts for a site.
  - Parameters: `page`, `per_page`, `status` (published/draft/all).
- `GET /publication`: Returns data of the latest site publication.
- `GET /languages`: Lists available languages for a site slug.

### API Documentation
- `GET /docs`: Returns a JSON payload describing the available API routes, methods, required authentication, and parameters.
