import express from 'express';
import mainRoutes from './routes/index';

const app = express();
const PORT = (process.env.PORT) ? process.env.PORT : 5000;

app.use(express.json());
app.use(mainRoutes);

app.use('/', mainRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
