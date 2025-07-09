import { Hono } from 'hono';
import posts from './posts.js';

const v1 = new Hono();

v1.route('/posts', posts);

export default v1;