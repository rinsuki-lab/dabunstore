import { Hono } from 'hono';
import v1 from './v1/index.js';

const api = new Hono().route('/v1', v1)

export default api;

export type ApiType = typeof api;