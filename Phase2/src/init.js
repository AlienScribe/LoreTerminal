// init.js

import { restoreSession, login } from './auth.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Attempt to restore an active WAX session
    await restoreSession()

    // Attach login button event
    const loginBtn = document.getElementById('walletLoginBtn')
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        await login()
      })
    } else {
      console.warn('Login button not found in DOM.')
    }
  } catch (err) {
    console.error('[INIT] Error during session initialization:', err)
  }
})
