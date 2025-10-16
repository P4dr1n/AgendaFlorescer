// src/middlewares/validate.middleware.ts

import { NextFunction, Request, Response } from 'express';
import { z, ZodObject } from 'zod';

export const validate = (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        return res.status(400).json({
          message: 'Erro de validação.',
          errors: fieldErrors,
        });
      }
      return next(error);
    }
  };