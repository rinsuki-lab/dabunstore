import { Hono } from 'hono';
import posts from './posts.js';

const v1 = new Hono();

export default v1.route('/posts', posts);;