export type MenuId = 'uxui' | 'print' | 'about'

export type MenuItem = {
  id: MenuId
  label: string
  ghost: boolean
  target: Page
}

export type Page = 'work' | 'print' | 'about'

export const MENU: MenuItem[] = [
  { id: 'uxui', label: 'UX/UI', ghost: true, target: 'work' },
  { id: 'print', label: 'Print', ghost: true, target: 'print' },
  { id: 'about', label: 'About me', ghost: true, target: 'about' },
]
