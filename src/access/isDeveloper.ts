import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type IsDeveloper = (args: AccessArgs<User>) => boolean

export const isDeveloper: IsDeveloper = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('developer'))
}
