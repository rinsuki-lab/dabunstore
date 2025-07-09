import { Hono } from 'hono';
import api from './api/index.js';

const routes = new Hono();

routes.route('/api', api);

export default routes;