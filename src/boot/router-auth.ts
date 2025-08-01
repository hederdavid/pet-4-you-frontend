import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth'

let routerInstance = null

export default boot(({ router }) => {
  routerInstance = router

  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthReady) {
      await authStore.fetchUser()
    }

    const requiresAuth = to.meta.requiresAuth
    const requiredRoles = to.meta.roles

    if (requiresAuth && !authStore.isLoggedIn) {
      return next({ name: 'login' })
    }

    // AGORA SEM ERRO! TypeScript sabe exatamente o que é authStore.user aqui.
    if (authStore.user && requiredRoles && Array.isArray(requiredRoles)) {
      if (!requiredRoles.includes(authStore.user.role)) {
        return next({ name: 'forbidden' })
      }
    }
    
    if (to.name === 'login' && authStore.isLoggedIn) {
        return next({ name: 'dashboard' })
    }

    return next()
  })
})

export { routerInstance }