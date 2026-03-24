// Storage shim — maps window.storage.get/set/list to localStorage
// The original component uses window.storage with (key, isShared) signature
// "shared" keys go to a shared prefix, "private" keys go to a private prefix

const SHARED_PREFIX = "shared::"
const PRIVATE_PREFIX = "private::"

function prefix(key, shared) {
  return (shared ? SHARED_PREFIX : PRIVATE_PREFIX) + key
}

window.storage = {
  async get(key, shared = false) {
    const val = localStorage.getItem(prefix(key, shared))
    return val != null ? { value: val } : null
  },

  async set(key, value, shared = false) {
    localStorage.setItem(prefix(key, shared), value)
  },

  async list(keyPrefix, shared = false) {
    const full = prefix(keyPrefix, shared)
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k.startsWith(full)) {
        // Return the original key (without our internal prefix)
        keys.push(k.slice(shared ? SHARED_PREFIX.length : PRIVATE_PREFIX.length))
      }
    }
    return { keys }
  },
}
