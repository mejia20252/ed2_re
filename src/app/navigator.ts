// src/app/navigator.ts
let nav: (path: string, opts?: { replace?: boolean }) => void = (p) => { window.location.href = p }

export const setNavigator = (fn: (path: string, opts?: { replace?: boolean }) => void) => { nav = fn }
export const navigateTo = (path: string, opts?: { replace?: boolean }) => nav(path, opts)
