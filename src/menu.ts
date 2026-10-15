export type MenuId = 'work' | 'about' | 'contact'

export type MenuItem = {
  id: MenuId
  label: string
  ghost: boolean
  target: string | null
}

export const MENU: MenuItem[] = [
  { id: 'work', label: 'work', ghost: false, target: 'work' },
  { id: 'about', label: 'about me', ghost: true, target: 'about' },
  { id: 'contact', label: 'contact', ghost: false, target: null },
]
