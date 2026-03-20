import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from '../routes/user.routes.js';
import userStatusRoutes from '../routes/userStatus.routes.js';
import roleRoutes from '../routes/role.routes.js';
import userApiRoutes from '../routes/apiUser.routes.js';
import modulesRoutes from '../routes/modules.routes.js';
import roleModuleRoutes from '../routes/roleModule.routes.js';
import profileRoutes from '../routes/profile.routes.js';

const app = express();
const NAME_API = '/api_v1';
app.use(cors());
app.use(express.json());

// Logs en terminal con method, url, status (200/400/500...), tiempo y size
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    skip: (req) => req.url === '/favicon.ico',
  }),
);

app.use('/auth', userApiRoutes); // Nuevo alias auth => /auth/register, /auth/login, /auth/verify-token
app.use(NAME_API, userRoutes);
app.use(NAME_API, userStatusRoutes);
app.use(NAME_API, roleRoutes);
app.use(NAME_API, userApiRoutes);
app.use(NAME_API, modulesRoutes);
app.use(NAME_API, roleModuleRoutes);
app.use(NAME_API, profileRoutes);

app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Endpoint losses 404, not found',
  });
});

// Manejador central de errores: imprime en terminal y responde con status adecuado
app.use((err, req, res, _next) => {
  const statusCode = Number(err?.statusCode || err?.status || 500);
  const safeStatus = Number.isFinite(statusCode) ? statusCode : 500;

  const message =
    err?.message?.toString?.() || 'Error interno del servidor (500)';

  console.error(
    `[${safeStatus}] ${req.method} ${req.originalUrl} -> ${message}`,
  );
  if (err?.stack) console.error(err.stack);

  res.status(safeStatus).json({
    ok: false,
    message,
    status: safeStatus,
  });
});

export default app;
