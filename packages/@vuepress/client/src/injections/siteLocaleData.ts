import { inject } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'
import { resolveLocaleData } from '@vuepress/shared'
import type { SiteData, SiteThemeConfig } from '@vuepress/shared'

export type SiteLocaleData<
  T extends SiteThemeConfig = SiteThemeConfig
> = SiteData<T>

export type SiteLocaleDataRef<
  T extends SiteThemeConfig = SiteThemeConfig
> = ComputedRef<SiteLocaleData<T>>

export const siteLocaleDataSymbol: InjectionKey<SiteLocaleDataRef> = Symbol(
  __DEV__ ? 'siteLocaleData' : ''
)

export const useSiteLocaleData = (): SiteLocaleDataRef => {
  const siteLocaleData = inject(siteLocaleDataSymbol)
  if (!siteLocaleData) {
    throw new Error('useSiteLocaleData() is called without provider.')
  }
  return siteLocaleData
}

/**
 * Merge the locales fields to the root fields
 * according to the route path
 */
export const resolveSiteLocaleData = <T extends SiteThemeConfig>(
  { base, lang, title, description, head, locales, themeConfig }: SiteData<T>,
  routePath: string
): SiteLocaleData<T> => ({
  base,
  lang,
  title,
  description,
  head,
  locales,
  ...resolveLocaleData(locales, routePath),
  themeConfig: {
    ...themeConfig,
    ...resolveLocaleData(themeConfig.locales ?? {}, routePath),
  },
})