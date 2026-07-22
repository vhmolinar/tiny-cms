# Filament Admin Resources

The CMS uses Filament 3.3 for its administrative interface. The resources are defined in `app/Filament/Resources`.

## Available Resources

1. **`SiteResource`**
   - Manages Sites/Tenants.
   - Includes fields for domains, language, SEO config, and theme config.
2. **`PostResource`**
   - Manages blog posts and articles.
   - Includes complex forms handling featured images, rich text editors, PageBuilder integration, and SEO metadata.
3. **`CategoryResource` & `TagResource`**
   - Taxonomy management scoped to Sites.
4. **`PageResource` & `FilamentorPageResource`**
   - Manages standalone pages built with the custom PageBuilder.
5. **`UserManagementResource` & `RoleResource`**
   - User administration and RBAC (Role-Based Access Control) configuration.
6. **`SitePublicationResource`**
   - Read-only or management view to inspect the history of site publications to Azure.
7. **`MenuResource` & `MenuItemResource`**
   - Navigation builders for the frontend sites.
8. **`ApiKeyResource`**
   - Manages API keys used to access the protected endpoints in `routes/api.php`.

The admin panel heavily leverages Livewire for interactive form components, such as dynamic PageBuilder blocks and temporary image uploads before they are processed by the `FileHandlerService`.
