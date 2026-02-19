<template>
  <div class="fixed inset-0 bg-black flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-elegant p-6 text-white">
      <div class="flex items-center justify-between max-w-4xl mx-auto">
        <h1 class="text-2xl font-serif font-bold">{{ t('admin.scanner.title') }}</h1>
        <button
          @click="$emit('close')"
          class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Scanner Area -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="relative max-w-2xl w-full">
        <!-- Video Stream -->
        <video
          ref="videoRef"
          class="w-full rounded-2xl shadow-2xl"
          autoplay
          playsinline
        ></video>

        <!-- Overlay de scan -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="relative w-64 h-64">
            <!-- Coins du cadre -->
            <div class="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-dore rounded-tl-2xl"></div>
            <div class="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-dore rounded-tr-2xl"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-dore rounded-bl-2xl"></div>
            <div class="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-dore rounded-br-2xl"></div>
            
            <!-- Ligne de scan animée -->
            <div class="absolute inset-0 overflow-hidden">
              <div class="h-1 bg-dore animate-scan"></div>
            </div>
          </div>
        </div>

        <!-- Canvas caché pour le traitement -->
        <canvas ref="canvasRef" class="hidden"></canvas>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-white p-6">
      <div class="max-w-4xl mx-auto">
        <div v-if="!scanning" class="text-center">
          <div class="animate-pulse text-6xl mb-4">📸</div>
          <p class="text-xl text-marron font-semibold mb-2">{{ t('admin.scanner.ready') }}</p>
          <p class="text-marron-light">{{ t('admin.scanner.instruction') }}</p>
        </div>

        <div v-else-if="lastScan" class="space-y-4">
          <div class="bg-green-50 border-2 border-green-500 rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-green-800 mb-2">{{ t('admin.scanner.verified') }}</h3>
                <p class="text-lg text-green-700"><strong>{{ t('admin.scanner.guestName') }}</strong> {{ lastScan.name }}</p>
                <p class="text-sm text-green-600 mt-1">{{ lastScan.email }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button
              @click="checkInGuest"
              class="flex-1 btn-primary py-4 text-lg"
            >
              {{ t('admin.scanner.validateEntry') }}
            </button>
            <button
              @click="lastScan = null"
              class="flex-1 btn-outline py-4 text-lg"
            >
              {{ t('admin.scanner.cancel') }}
            </button>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border-2 border-red-500 rounded-2xl p-6">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-700 font-semibold">{{ error }}</p>
          </div>
        </div>

        <!-- Stats du jour -->
        <div class="mt-6 grid grid-cols-3 gap-4">
          <div class="text-center p-4 bg-gradient-to-br from-ivoire to-ivoire-dark rounded-xl">
            <div class="text-3xl font-bold text-dore">{{ stats.scanned }}</div>
            <div class="text-sm text-marron-light mt-1">{{ t('admin.scanner.scanned') }}</div>
          </div>
          <div class="text-center p-4 bg-gradient-to-br from-ivoire to-ivoire-dark rounded-xl">
            <div class="text-3xl font-bold text-green-600">{{ stats.checkedIn }}</div>
            <div class="text-sm text-marron-light mt-1">{{ t('admin.scanner.validated') }}</div>
          </div>
          <div class="text-center p-4 bg-gradient-to-br from-ivoire to-ivoire-dark rounded-xl">
            <div class="text-3xl font-bold text-marron">{{ stats.remaining }}</div>
            <div class="text-sm text-marron-light mt-1">{{ t('admin.scanner.remaining') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { decodeQRCodeData } from '@/utils/qrcode'
import { t } from '@/i18n'

defineEmits(['close'])

const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()
const scanning = ref(false)
const lastScan = ref<any>(null)
const error = ref('')
const stream = ref<MediaStream>()
const isBarcodeDetectorSupported = typeof window !== 'undefined' && 'BarcodeDetector' in window

const stats = ref({
  scanned: 0,
  checkedIn: 0,
  remaining: 150 // À récupérer depuis la base
})

async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      startScanning()
    }
  } catch (err) {
    error.value = t('admin.scanner.cameraError')
    console.error(err)
  }
}

function startScanning() {
  if (!isBarcodeDetectorSupported) {
    error.value = t('admin.scanner.unsupportedDetector')
    return
  }

  scanning.value = true
  void scanQRCode()
}

async function detectQRCodeFromCanvas(canvas: HTMLCanvasElement): Promise<string | null> {
  const BarcodeDetectorCtor = (window as Window & { BarcodeDetector?: new (options?: { formats?: string[] }) => { detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector

  if (!BarcodeDetectorCtor) {
    return null
  }

  try {
    const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] })
    const results = await detector.detect(canvas)
    return results[0]?.rawValue ?? null
  } catch {
    return null
  }
}

async function scanQRCode() {
  if (!scanning.value || !videoRef.value || !canvasRef.value) return

  const video = videoRef.value
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
    requestAnimationFrame(() => { void scanQRCode() })
    return
  }

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  const qrRawValue = await detectQRCodeFromCanvas(canvas)

  if (qrRawValue) {
    const data = decodeQRCodeData(qrRawValue)
    if (data) {
      lastScan.value = data
      stats.value.scanned++
      scanning.value = false
    } else {
      error.value = t('admin.scanner.invalidQr')
      setTimeout(() => { error.value = '' }, 3000)
    }
  }

  if (scanning.value) {
    requestAnimationFrame(() => { void scanQRCode() })
  }
}

async function checkInGuest() {
  if (!lastScan.value) return

  try {
    // TODO: Appel API pour marquer le check-in
    // await useGuests().checkInGuest(lastScan.value.guestId)
    
    stats.value.checkedIn++
    stats.value.remaining--
    
    // Réinitialiser et continuer le scan
    setTimeout(() => {
      lastScan.value = null
      scanning.value = true
      void scanQRCode()
    }, 2000)
  } catch (err) {
    error.value = t('admin.scanner.validationError')
    console.error(err)
  }
}

function stopCamera() {
  scanning.value = false
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(256px);
  }
}

.animate-scan {
  animation: scan 2s linear infinite;
}
</style>
