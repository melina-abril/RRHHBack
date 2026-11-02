import { projectAssignmentsRouter } from './modules/project-assignments/project-assignments.router';
import { createApp } from './shared/http/create-app';

export const app = createApp({
  '/project-assignments': projectAssignmentsRouter,
});
