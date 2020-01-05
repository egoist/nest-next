import {
  Module,
  DynamicModule,
  Inject,
  MiddlewareConsumer,
} from '@nestjs/common'
import next from 'next'
import { NEXT_MODULE_OPTIONS, NEXT_APP_PROVIDER } from './next.constants'
import { NextApp, NextModuleOptions } from './next.type'
import { HttpAdapterHost } from '@nestjs/core'

@Module({})
export class NextModule {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(NEXT_APP_PROVIDER) private readonly nextApp: NextApp
  ) {}

  static register(options: NextModuleOptions): DynamicModule {
    const nextAppProvider = {
      provide: NEXT_APP_PROVIDER,
      async useFactory() {
        const nextApp = next(options)
        await nextApp.prepare()
        return nextApp
      }
    }
    return {
      module: NextModule,
      providers: [
        {
          provide: NEXT_MODULE_OPTIONS,
          useValue: options
        },
        nextAppProvider
      ],
      exports: [nextAppProvider]
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: any, res: any, next: Function) => {
        res.nextRender = (path: string, query: any) => {
          this.nextApp.render(req, res, path, query)
        }
        next()
      })
      .forRoutes('*')
  }

  onModuleInit() {
    const httpAdapter = this.httpAdapterHost.httpAdapter
    const instance = httpAdapter.getInstance()
    instance.use((req: any, res: any, next: Function) => {
      // Somehow @nestjs/graphql applies its middleware after this module, so we skip it here
      if (req.path === '/graphql') {
        return next()
      }
      return this.nextApp.render(req, res, req.path, req.query)
    })
  }
}
