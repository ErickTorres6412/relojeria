// app/plugins/snipcart.client.ts
const SNIPCART_CDN = 'https://cdn.snipcart.com/themes/v3.0/default'

export default defineNuxtPlugin((nuxtApp) => {
  const { snipcartApiKey } = useRuntimeConfig().public
  const cartCount = useState('cart-count', () => 0)

  // Configuración que Snipcart lee al cargarse
  const w = window as any
  w.SnipcartSettings = {
    publicApiKey: snipcartApiKey,
    modalStyle: 'side',
    currency: 'usd',
    language: 'es'
  }

  // Cuando Snipcart está listo, mantener el contador sincronizado con el carrito
  document.addEventListener('snipcart.ready', () => {
    w.Snipcart.api.session.setLanguage('es')
    const update = () => {
      cartCount.value = w.Snipcart.store.getState().cart.items.count
    }
    update()
    w.Snipcart.store.subscribe(update)
  })

  // Se inyecta después de montar la aplicación para no alterar la hidratación
  nuxtApp.hook('app:mounted', () => {
    const container = document.createElement('div')
    container.id = 'snipcart'
    container.hidden = true
    container.dataset.apiKey = snipcartApiKey
    container.dataset.configModalStyle = 'side'
    container.dataset.currency = 'usd'
    document.body.appendChild(container)

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = `${SNIPCART_CDN}/snipcart.css`
    document.head.appendChild(style)

    const script = document.createElement('script')
    script.src = `${SNIPCART_CDN}/snipcart.js`
    script.async = true
    document.head.appendChild(script)
  })
})
