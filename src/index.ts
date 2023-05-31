import { Request, Response } from 'express';
import * as express from 'express';
import { v4 } from 'uuid';

/**
 * @klotho::persist {
 *   id = "tasks"
 * }
 */
const tasks = new Map<string, string>();

const app = express();
app.use(express.json());

app.post('/tasks', async (req: Request, res: Response) => {
  const { value } = req.body;
  const key = v4();
  await tasks.set(key, value);
  res.status(201).send({
    key,
    value: await tasks.get(key),
  });
});

app.get('/tasks', async (req: Request, res: Response) => {
  res.send(Object.fromEntries(await tasks.entries()));
});

app.get('/tasks/:key', async (req: Request, res: Response) => {
  const key = req.params.key;
  const value = await tasks.get(key);
  res.send({
    key,
    value,
  });
});

app.patch('/tasks/:key', async (req: Request, res: Response) => {
  const key = req.params.key;
  const { value } = req.body;
  await tasks.set(key, value);
  res.send({
    key,
    value: await tasks.get(key),
  });
});

app.delete('/tasks/:key', async (req: Request, res: Response) => {
  const key = req.params.key;
  await tasks.delete(key);
  res.send(`Success`);
});

/**
 * @klotho::expose {
 *  id = "app"
 *  target = "public"
 * }
 */
app.listen(3000, () => {
  console.log('Server is up and running at http://localhost:3000');
});
