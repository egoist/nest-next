declare global {
  namespace Express {
    export interface Response {
      nextRender: (path: string, query: any) => void
    }
  }
}

export * from './dist'