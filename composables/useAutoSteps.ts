import { onBeforeUnmount, ref, unref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

// Reveals content on a timer: steps count up 1..total once this slide becomes the current one,
// and reset when it is left. Thumbnails, overview and next-slide previews show everything.
export function useAutoSteps(total: number, interval = 1400, first = 700) {
  const step = ref(0)
  const { $nav, $page, $renderContext } = useSlideContext() as any
  let timers: number[] = []
  const stop = () => { timers.forEach(clearTimeout); timers = [] }
  const start = () => {
    stop()
    step.value = 0
    for (let i = 1; i <= total; i++) timers.push(window.setTimeout(() => { step.value = i }, first + (i - 1) * interval))
  }
  watch(
    () => [unref($renderContext), unref($nav).currentPage === unref($page)] as const,
    ([ctx, active]) => {
      if (ctx !== 'slide') { stop(); step.value = total; return }
      if (active) start()
      else { stop(); timers.push(window.setTimeout(() => { step.value = 0 }, 800)) } // keep content while the slide transition plays
    },
    { immediate: true },
  )
  onBeforeUnmount(stop)
  return step
}
