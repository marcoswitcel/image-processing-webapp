// https://svelte.dev/docs/kit/single-page-apps#Usage
// https://svelte.dev/docs/kit/page-options#csr

// pra gerar os arquivos por página preciso por o prerender como `true`
export const prerender = true;
// força a usar URLs com "/" no final, assim cai nas pastas de mesmo nome e aciona o index.html da pasta
export const trailingSlash = 'always';
export const ssr = false;
