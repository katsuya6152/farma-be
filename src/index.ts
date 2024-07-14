import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign } from 'hono/jwt';
import { shipping, todos, users } from '../db/schema';

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

app.use(
	'/*',
	cors({
		origin: ['https://farma-fe.pages.dev', 'http://localhost:3000'],
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

// 1件データ取得
app.get('/todos/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'));
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select().from(todos).where(eq(todos.id, id));
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 全件データ取得
app.get('/todos', async (c) => {
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select().from(todos);
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 新規登録
app.post('/todos', async (c) => {
	const todo = await c.req.json<typeof todos.$inferInsert>();
	try {
		const db = drizzle(c.env.DB);
		await db.insert(todos).values(todo);
		return c.json({ message: 'Success' }, 201);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 更新
app.put('/todos/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'));
	const { todo, score, isDone } = await c.req.json<typeof todos.$inferInsert>();
	try {
		const db = drizzle(c.env.DB);
		await db.update(todos).set({ todo, score, isDone }).where(eq(todos.id, id));
		return c.json({ message: 'Success' }, 200);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 削除
app.delete('/todos/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'));
	try {
		const db = drizzle(c.env.DB);
		await db.delete(todos).where(eq(todos.id, id));
		return c.json({ message: 'Success' }, 200);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 出荷データ全件取得
app.get('/shipping', async (c) => {
	try {
		const db = drizzle(c.env.DB);
		const results = await db.select().from(shipping);
		return c.json(results);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 出荷データ新規登録
app.post('/shipping', async (c) => {
	const data = await c.req.json<typeof shipping.$inferInsert>();
	try {
		const db = drizzle(c.env.DB);
		await db.insert(shipping).values(data);
		return c.json({ message: 'Success' }, 201);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 出荷データ更新
app.put('/shipping/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'));
	const data = await c.req.json<typeof shipping.$inferInsert>();
	try {
		const db = drizzle(c.env.DB);
		await db.update(shipping).set(data).where(eq(shipping.id, id));
		return c.json({ message: 'Success' }, 200);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// 出荷データ削除
app.delete('/shipping/:id', async (c) => {
	const id = Number.parseInt(c.req.param('id'));
	try {
		const db = drizzle(c.env.DB);
		await db.delete(shipping).where(eq(shipping.id, id));
		return c.json({ message: 'Success' }, 200);
	} catch (e) {
		return c.json({ err: e }, 500);
	}
});

// ユーザー登録
app.post('/users/register', async (c) => {
	const { username, email, password } = await c.req.json();
	const passwordHash = await bcrypt.hash(password, 10);

	try {
		const db = drizzle(c.env.DB);
		console.log(username, email, passwordHash);
		await db.insert(users).values({ username, email, passwordHash });
		return c.json({}, 201);
	} catch (error) {
		console.error(error);
		return c.json({ message: 'Unable to register user.' }, 400);
	}
});

// ユーザーログイン
app.post('/users/login', async (c) => {
	const { email, password } = await c.req.json();

	try {
		const db = drizzle(c.env.DB);
		const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
		if (user && (await bcrypt.compare(password, user[0].passwordHash))) {
			const token = await sign({ id: user[0].id }, 'secret');
			return c.json({ jwt: token });
		}
		return c.json({ message: 'Invalid email or password.' }, 401);
	} catch (error) {
		console.error(error);
		return c.json({ message: 'Authentication failed.' }, 500);
	}
});

export default app;
