# Nest module for Next.js

Use [Next.js](https://nextjs.org/) with a [Nest.js](https://nestjs.com/) server.

## Why?

Allow you to manage both your frontend and backend in a single repository. And you maintain one domain `example.com` instead of two: `example.com` and `api.example.com`.

## Install

```bash
yarn add @nest-module/next next react react-dom

# Following typings are also needed
yarn add @types/react @types/node --dev
```

## Usage

In your `src/app.module.ts`:

```ts
import { join } from 'path'
import { NextModule } from '@nest-module/next'

@Module({
  imports: [
    NextModule.register({
      dev: process.env.NODE_ENV !== 'production',
      // It's recommended to populate your Next.js app in a sub directory 
      // like ./next folder so that it could use its own tsconfig.json
      dir: join(__dirname, '../next')
    })
  ]
})
export class AppModule {}
```

Then you can use file-system based routing, try populating a page at `next/pages/index.tsx`:

```tsx
export default () => <div>Hello Next!</div>
```

And configure your root `tsconfig.build.json` to include `src` folder only:

```json
{
  "include": ["src"]
}
```

Next.js will automatically create another TS config file at `next/tsconfig.json`, we want the root TS config to be applied to your Nest server only.

Now start your Nest server and navigate to the homepage and you will see `Hello Next!`.

### Manually render a page

Besides automatic routing via `pages` folder, you can also use `res.nextRender` inside a Nest route handler to render a Next.js page:

```js
import { Res, Controller, Get } from '@nestjs/common'
import { Response } from 'express'

@Controller()
export class AppController {
  @Get('/some-page')
  anotherPage(@Res() res: Response) {
    res.nextRender('/another-page', {
      // optional route query
      message: 'another page'
    })
  }
}
```

This route handler will render `pages/another-page.tsx`:

```tsx
const AnotherPage = ({ query }) => {
  return <div>{query.message}</div>
}

// `getInitialProps` is required if you want to access `query` in your page component
AnotherPage.getInitialProps = ctx => {
  return { query: ctx.query }
}

export default AnotherPage
```

## License

MIT.
