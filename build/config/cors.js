import { defineConfig } from '@adonisjs/cors';
const corsConfig = defineConfig({
    enabled: true,
    origin: ['http://localhost:3000', 'https://jm-todo-nextjs.vercel.app'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    headers: true,
    exposeHeaders: [],
    credentials: true,
    maxAge: 90,
});
export default corsConfig;
//# sourceMappingURL=cors.js.map