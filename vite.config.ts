const config: import("vite").UserConfig = {
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