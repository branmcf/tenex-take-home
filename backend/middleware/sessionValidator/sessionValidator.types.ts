/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Augment express's Response to include a session object in res.locals

declare global {
    namespace Express {
        interface Locals {

            // TODO: define a proper type for session
            session?: any;
        }
    }
}

export {};