// Resolves a file in public/ against the deck's base path, so images also load when the site is served from a
// sub-path such as https://<user>.github.io/<repo>/ (built with `--base ./`). Static src="/figures/..." in templates
// is rewritten by Vite, but dynamically bound paths are not.
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
