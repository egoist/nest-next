import next from 'next'

export type NextModuleOptions = {
  dev?: boolean
  dir?: string
}

export type NextApp = ReturnType<typeof next>
