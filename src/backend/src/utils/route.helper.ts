
import { Request, Response, NextFunction } from 'express';

type AsyncRouteHandler = (req: Request, res: Response) => Promise<any>;

export const createRouteHandler = (handler: AsyncRouteHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
};