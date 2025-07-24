const config: import("vite").UserConfig = {
    build: {
        outDir: "dist/frontend",
        emptyOutDir: true,
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            }
        }
    }
}

export default config