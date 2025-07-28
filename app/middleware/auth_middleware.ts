import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default async function authMiddleware(
  ctx: HttpContext,
  next: NextFn,
  options: {
    guards?: (keyof Authenticators)[]
  } = {}
) {
  const redirectTo = '/login'

  await ctx.auth.authenticateUsing(options.guards, {
    loginRoute: redirectTo,
  })

  return next()
}