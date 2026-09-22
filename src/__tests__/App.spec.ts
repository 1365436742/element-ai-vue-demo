import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})
afterEach(() => vi.unstubAllGlobals())

describe('App', () => {
  it('renders the chat workspace with navigation and a theme control', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: { RouterView: true },
      },
    })
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('aside').text()).toContain('开启新对话')
    await wrapper.get('[aria-label="切换深色模式"]').trigger('click')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    await wrapper.get('[aria-label="切换浅色模式"]').trigger('click')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    wrapper.unmount()
  })
})
