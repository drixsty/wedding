import { computed, ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { DEFAULT_SITE_CONTENT, type SiteContentConfig } from '@/constants/siteContent'
import { useTenant } from '@/composables/useTenant'

const content = ref<SiteContentConfig>({ ...DEFAULT_SITE_CONTENT, carousel: [...DEFAULT_SITE_CONTENT.carousel] })
const loading = ref(false)
const error = ref<string | null>(null)

function sanitizeContent(input?: Partial<SiteContentConfig> | null): SiteContentConfig {
  const fallback = DEFAULT_SITE_CONTENT

  const sanitizedCarousel = Array.isArray(input?.carousel) && input?.carousel.length > 0
    ? input.carousel
      .slice(0, 12)
      .map((item, index) => ({
        title: (item?.title || fallback.carousel[index % fallback.carousel.length].title).toString().trim(),
        caption: (item?.caption || fallback.carousel[index % fallback.carousel.length].caption).toString().trim(),
        alt: (item?.alt || fallback.carousel[index % fallback.carousel.length].alt).toString().trim(),
        imageUrl: (item?.imageUrl || fallback.carousel[index % fallback.carousel.length].imageUrl).toString().trim()
      }))
    : [...fallback.carousel]

  return {
    coupleName: (input?.coupleName || fallback.coupleName).toString().trim(),
    weddingLocation: (input?.weddingLocation || fallback.weddingLocation).toString().trim(),
    weddingDate: (input?.weddingDate || fallback.weddingDate).toString().trim(),
    contactEmail: (input?.contactEmail || fallback.contactEmail).toString().trim(),
    nav: {
      home: (input?.nav?.home || fallback.nav.home).toString().trim(),
      gallery: (input?.nav?.gallery || fallback.nav.gallery).toString().trim(),
      rsvp: (input?.nav?.rsvp || fallback.nav.rsvp).toString().trim(),
      adminLogin: (input?.nav?.adminLogin || fallback.nav.adminLogin).toString().trim()
    },
    footer: {
      navigationTitle: (input?.footer?.navigationTitle || fallback.footer.navigationTitle).toString().trim(),
      contactTitle: (input?.footer?.contactTitle || fallback.footer.contactTitle).toString().trim(),
      questions: (input?.footer?.questions || fallback.footer.questions).toString().trim(),
      rights: (input?.footer?.rights || fallback.footer.rights).toString().trim(),
      madeWithCare: (input?.footer?.madeWithCare || fallback.footer.madeWithCare).toString().trim()
    },
    home: {
      subtitle: (input?.home?.subtitle || fallback.home.subtitle).toString().trim(),
      cta: (input?.home?.cta || fallback.home.cta).toString().trim(),
      momentsTitle: (input?.home?.momentsTitle || fallback.home.momentsTitle).toString().trim(),
      momentsSubtitle: (input?.home?.momentsSubtitle || fallback.home.momentsSubtitle).toString().trim(),
      heroImageUrl: (input?.home?.heroImageUrl || fallback.home.heroImageUrl).toString().trim()
    },
    galleryPage: {
      title: (input?.galleryPage?.title || fallback.galleryPage.title).toString().trim(),
      subtitle: (input?.galleryPage?.subtitle || fallback.galleryPage.subtitle).toString().trim()
    },
    rsvpPage: {
      title: (input?.rsvpPage?.title || fallback.rsvpPage.title).toString().trim(),
      subtitle: (input?.rsvpPage?.subtitle || fallback.rsvpPage.subtitle).toString().trim()
    },
    carousel: sanitizedCarousel
  }
}

async function loadSiteContent() {
  loading.value = true
  error.value = null

  const { tenantSlug } = useTenant()

  try {
    const { data, error: queryError } = await supabase
      .from('site_content')
      .select('content')
      .eq('tenant_slug', tenantSlug.value)
      .maybeSingle()

    if (queryError) {
      throw queryError
    }

    content.value = sanitizeContent((data?.content as Partial<SiteContentConfig> | undefined) ?? null)
  } catch (err: any) {
    error.value = err.message
    content.value = sanitizeContent(null)
  } finally {
    loading.value = false
  }
}

async function saveSiteContent(nextContent: SiteContentConfig) {
  loading.value = true
  error.value = null

  const { tenantSlug } = useTenant()
  const sanitized = sanitizeContent(nextContent)

  try {
    const { error: saveError } = await supabase
      .from('site_content')
      .upsert({
        tenant_slug: tenantSlug.value,
        content: sanitized
      }, { onConflict: 'tenant_slug' })

    if (saveError) {
      throw saveError
    }

    content.value = sanitized
    return { error: null }
  } catch (err: any) {
    error.value = err.message
    return { error: err.message }
  } finally {
    loading.value = false
  }
}

export function useSiteContent() {
  return {
    content,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    sanitizeContent,
    loadSiteContent,
    saveSiteContent
  }
}
