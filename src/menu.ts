export type MenuId = 'uxui' | 'print' | 'about'

export type MenuItem = {
  id: MenuId
  label: string
  ghost: boolean
  target: 'work' | 'about' | null
}

export const MENU: MenuItem[] = [
  { id: 'uxui', label: 'UX/UI', ghost: true, target: 'work' },
  { id: 'print', label: 'Print', ghost: true, target: null },
  { id: 'about', label: 'About me', ghost: true, target: 'about' },
]
