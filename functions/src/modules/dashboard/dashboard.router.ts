/**
 * Módulo dashboard: no expone endpoints HTTP propios.
 * 
 * La pantalla principal solo muestra contenido estático y orientativo.
 * Si a futuro se agregan endpoints para indicadores u otros datos de resumen, defínelos aquí siguiendo el patrón.
 */
import { Router } from 'express';

/**
 * El router se exporta para cumplir el patrón de la arquitectura; por ahora no define rutas propias,
 * ya que toda la lógica está en el frontend y el acceso requiere sesión (ya resuelto por requireAuth global).
 */
export const dashboardRouter = Router();
