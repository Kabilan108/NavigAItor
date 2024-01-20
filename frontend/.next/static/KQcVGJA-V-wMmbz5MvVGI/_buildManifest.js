(self.__BUILD_MANIFEST = {
  __rewrites: {
    beforeFiles: [],
    afterFiles: [
      { source: "/api/:path*" },
      { source: "/docs" },
      { source: "/openapi.json" },
    ],
    fallback: [],
  },
  "/_error": ["static/chunks/pages/_error-d79168f986538ac0.js"],
  sortedPages: ["/_app", "/_error"],
}),
  self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB();
