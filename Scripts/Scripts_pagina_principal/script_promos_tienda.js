const supabaseUrl = 'https://qxbkfmvugutmggqwxhrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YmtmbXZ1Z3V0bWdncXd4aHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTEzMDEsImV4cCI6MjA3MzgyNzMwMX0.Qsx0XpQaSgt2dKUaLs8GvMmH8Qt6Dp_TQM25a_WOa8E'
const { createClient } = supabase
const client = createClient(supabaseUrl, supabaseKey)

let modalOferta = null
let ultimoElementoActivo = null

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarPaginaOfertas)
} else {
    inicializarPaginaOfertas()
}

function inicializarPaginaOfertas() {
    inicializarModalOferta()
    cargarOfertas()
}

async function cargarOfertas() {
    const contenedorPromos = document.getElementById('conten-ofertas')

    if (!contenedorPromos) {
        return
    }

    try {
        const { data, error } = await client
            .from('Ofertas')
            .select('*')

        if (error) {
            throw error
        }

        const ofertas = Array.isArray(data) ? [...data].reverse() : []
        renderizarOfertas(ofertas)
        actualizarResumen(ofertas)
    } catch (error) {
        console.error(error)
        contenedorPromos.innerHTML = ''
        contenedorPromos.appendChild(crearEstadoVacio('No se pudieron cargar las ofertas', 'Verificá tu conexión o intentá nuevamente en unos segundos.'))
        actualizarResumen([])

        if (typeof window.showError === 'function') {
            await window.showError('Error al cargar las promociones', 'Error')
        }
    }
}

function renderizarOfertas(ofertas) {
    const contenedorPromos = document.getElementById('conten-ofertas')

    if (!contenedorPromos) {
        return
    }

    contenedorPromos.innerHTML = ''

    if (!ofertas.length) {
        contenedorPromos.appendChild(crearEstadoVacio('No hay ofertas activas', 'Cuando haya nuevas promociones semanales van a aparecer acá.'))
        return
    }

    const fragment = document.createDocumentFragment()

    ofertas.forEach((oferta) => {
        fragment.appendChild(crearPromoTCard(oferta))
    })

    contenedorPromos.appendChild(fragment)
}

function crearPromoTCard(oferta) {
    const article = document.createElement('article')
    article.className = 'oferta-card'

    const imageWrapper = document.createElement('div')
    imageWrapper.className = 'oc-image'

    const imagen = document.createElement('img')
    imagen.src = obtenerUrlImagen(oferta)
    imagen.alt = `Imagen de ${obtenerNombre(oferta)}`
    imagen.loading = 'lazy'
    imagen.onerror = () => {
        imagen.onerror = null
        imagen.src = crearPlaceholderImagen(obtenerNombre(oferta))
    }

    imageWrapper.appendChild(imagen)

    const categoria = document.createElement('span')
    categoria.className = 'oc-cat'
    categoria.textContent = obtenerCategoria(oferta).toUpperCase()
    imageWrapper.appendChild(categoria)

    const badgeTexto = obtenerBadge(oferta)
    if (badgeTexto) {
        const badge = document.createElement('span')
        badge.className = 'oc-discount'
        badge.textContent = badgeTexto
        imageWrapper.appendChild(badge)
    }

    const expiry = document.createElement('div')
    expiry.className = 'oc-expiry'

    const expiryDot = document.createElement('span')
    expiryDot.className = 'expiry-dot'

    if (esOfertaUrgente(obtenerVigencia(oferta))) {
        expiryDot.classList.add('ending')
    }

    const expiryText = document.createElement('span')
    expiryText.textContent = obtenerVigencia(oferta)

    expiry.appendChild(expiryDot)
    expiry.appendChild(expiryText)
    imageWrapper.appendChild(expiry)

    const body = document.createElement('div')
    body.className = 'oc-body'

    const titulo = document.createElement('h2')
    titulo.className = 'oc-title'
    titulo.textContent = obtenerNombre(oferta)

    const desc = document.createElement('p')
    desc.className = 'oc-desc'
    desc.textContent = obtenerDescripcion(oferta)

    body.appendChild(titulo)
    body.appendChild(desc)

    const footer = document.createElement('div')
    footer.className = 'oc-footer'

    const stock = document.createElement('div')
    stock.className = 'oc-stock'

    const stockDot = document.createElement('span')
    stockDot.className = `stock-dot ${obtenerClaseStock(oferta)}`.trim()

    const stockText = document.createElement('span')
    stockText.textContent = obtenerTextoStock(oferta)

    stock.appendChild(stockDot)
    stock.appendChild(stockText)

    const actions = document.createElement('div')
    actions.className = 'oc-actions'

    const estado = document.createElement('span')
    estado.className = 'btn btn-ghost btn-sm btn-status'
    estado.textContent = `✓ ${obtenerEstadoOferta(oferta)}`

    const verImagen = document.createElement('button')
    verImagen.type = 'button'
    verImagen.className = 'btn btn-ver'
    verImagen.textContent = 'Ver imagen'
    verImagen.setAttribute('aria-label', `Ver imagen de ${obtenerNombre(oferta)}`)
    verImagen.addEventListener('click', () => abrirModalOferta(oferta))

    actions.appendChild(estado)
    actions.appendChild(verImagen)

    footer.appendChild(stock)
    footer.appendChild(actions)

    article.appendChild(imageWrapper)
    article.appendChild(body)
    article.appendChild(footer)

    return article
}

function actualizarResumen(ofertas) {
    const total = ofertas.length
    const descuentos = ofertas
        .map((oferta) => obtenerDescuentoNumerico(obtenerBadge(oferta)))
        .filter((valor) => Number.isFinite(valor) && valor > 0)
    const categorias = new Set(
        ofertas
            .map((oferta) => obtenerCategoriaReal(oferta))
            .filter(Boolean)
    )

    actualizarTexto('result-count', total === 1 ? '1 oferta activa' : `${total} ofertas activas`)
    actualizarTexto('stat-total', String(total))
    actualizarTexto('stat-maxdesc', descuentos.length ? `${Math.max(...descuentos)}%` : '—')
    actualizarTexto('stat-avgdesc', descuentos.length ? `${Math.round(descuentos.reduce((acumulado, valor) => acumulado + valor, 0) / descuentos.length)}%` : '—')
    actualizarTexto('stat-cats', categorias.size ? String(categorias.size) : '—')
}

function inicializarModalOferta() {
    const overlay = document.getElementById('modal-overlay')

    if (!overlay || overlay.dataset.ready === 'true') {
        return
    }

    modalOferta = {
        overlay,
        closeButton: document.getElementById('modal-close'),
        secondaryCloseButton: document.getElementById('modal-btn-close'),
        image: document.getElementById('modal-img'),
        category: document.getElementById('modal-cat'),
        title: document.getElementById('modal-title'),
        description: document.getElementById('modal-desc'),
        categoryDetail: document.getElementById('md-original'),
        benefitDetail: document.getElementById('md-ahorro'),
        stockDetail: document.getElementById('md-stock'),
        validityDetail: document.getElementById('md-vigencia'),
    }

    overlay.dataset.ready = 'true'

    modalOferta.closeButton?.addEventListener('click', cerrarModalOferta)
    modalOferta.secondaryCloseButton?.addEventListener('click', cerrarModalOferta)
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            cerrarModalOferta()
        }
    })

    document.addEventListener('keydown', manejarCierreConEscape)
}

function abrirModalOferta(oferta) {
    if (!modalOferta?.overlay) {
        inicializarModalOferta()
    }

    if (!modalOferta?.overlay) {
        return
    }

    const nombre = obtenerNombre(oferta)
    const imagen = obtenerUrlImagen(oferta)

    ultimoElementoActivo = document.activeElement instanceof HTMLElement ? document.activeElement : null

    modalOferta.image.src = imagen
    modalOferta.image.alt = `Imagen completa de ${nombre}`
    modalOferta.image.onerror = () => {
        modalOferta.image.onerror = null
        modalOferta.image.src = crearPlaceholderImagen(nombre)
    }

    modalOferta.category.textContent = obtenerCategoria(oferta)
    modalOferta.title.textContent = nombre
    modalOferta.description.textContent = obtenerDescripcion(oferta)
    modalOferta.categoryDetail.textContent = obtenerCategoria(oferta)
    modalOferta.benefitDetail.textContent = obtenerBeneficio(oferta)
    modalOferta.stockDetail.textContent = obtenerTextoStock(oferta)
    modalOferta.validityDetail.textContent = obtenerVigencia(oferta)

    modalOferta.overlay.classList.add('open')
    modalOferta.overlay.setAttribute('aria-hidden', 'false')
    document.body.classList.add('modal-open')
    modalOferta.closeButton?.focus()
}

function cerrarModalOferta() {
    if (!modalOferta?.overlay?.classList.contains('open')) {
        return
    }

    modalOferta.overlay.classList.remove('open')
    modalOferta.overlay.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')

    if (ultimoElementoActivo && typeof ultimoElementoActivo.focus === 'function') {
        ultimoElementoActivo.focus()
    }

    ultimoElementoActivo = null
}

function manejarCierreConEscape(event) {
    if (event.key === 'Escape') {
        cerrarModalOferta()
    }
}

function actualizarTexto(id, valor) {
    const element = document.getElementById(id)

    if (element) {
        element.textContent = valor
    }
}

function obtenerNombre(oferta) {
    return String(leerCampo(oferta, ['nombre', 'titulo', 'title']) || 'Oferta destacada')
}

function obtenerDescripcion(oferta) {
    return String(leerCampo(oferta, ['desripcion', 'descripcion', 'detalle', 'detalle_oferta']) || 'Consultá en la sucursal por condiciones y disponibilidad.')
}

function obtenerCategoriaReal(oferta) {
    return leerCampo(oferta, ['categoria', 'categoria_oferta', 'tipo', 'seccion'])
}

function obtenerCategoria(oferta) {
    return String(obtenerCategoriaReal(oferta) || 'Oferta')
}

function obtenerBadge(oferta) {
    return String(leerCampo(oferta, ['campo_flotante', 'badge', 'promo_badge', 'etiqueta']) || '').trim()
}

function obtenerBeneficio(oferta) {
    return obtenerBadge(oferta) || obtenerEstadoOferta(oferta)
}

function obtenerVigencia(oferta) {
    return String(leerCampo(oferta, ['vigencia', 'fecha_vigencia', 'valido_hasta']) || 'Vigente esta semana')
}

function obtenerTextoStock(oferta) {
    return String(leerCampo(oferta, ['stock_texto', 'estado_stock', 'disponibilidad', 'stock']) || 'Stock disponible')
}

function obtenerEstadoOferta(oferta) {
    return String(leerCampo(oferta, ['estado_boton', 'estado', 'cta_estado']) || 'Oferta activa')
}

function obtenerClaseStock(oferta) {
    const stock = obtenerTextoStock(oferta).toLowerCase()

    if (stock.includes('sin') || stock.includes('agot')) {
        return 'out'
    }

    if (stock.includes('poco') || stock.includes('últim') || stock.includes('ultim')) {
        return 'low'
    }

    return ''
}

function obtenerUrlImagen(oferta) {
    const rawUrl = String(leerCampo(oferta, ['Url_img', 'url_img', 'urlImg', 'imagen', 'imagen_url', 'image_url']) || '').trim()

    if (!rawUrl) {
        return crearPlaceholderImagen(obtenerNombre(oferta))
    }

    if (/^(https?:|data:|blob:|\/)/i.test(rawUrl) || rawUrl.startsWith('./') || rawUrl.startsWith('../')) {
        return rawUrl
    }

    return `/${rawUrl.replace(/^\/+/, '')}`
}

function obtenerDescuentoNumerico(textoBadge) {
    const match = String(textoBadge || '').match(/(\d{1,3})\s*%/)
    return match ? Number(match[1]) : Number.NaN
}

function esOfertaUrgente(vigencia) {
    const texto = String(vigencia || '').toLowerCase()
    return ['hoy', 'vence', 'últim', 'ultim', 'termina'].some((fragmento) => texto.includes(fragmento))
}

function leerCampo(objeto, campos) {
    for (const campo of campos) {
        const valor = objeto?.[campo]

        if (valor === 0) {
            return valor
        }

        if (typeof valor === 'string' && valor.trim() !== '') {
            return valor.trim()
        }

        if (valor !== null && valor !== undefined && valor !== '') {
            return valor
        }
    }

    return null
}

function crearEstadoVacio(titulo, descripcion) {
    const wrapper = document.createElement('div')
    wrapper.className = 'empty-state'

    const icono = document.createElement('div')
    icono.className = 'ei'
    icono.textContent = '🏪'

    const heading = document.createElement('h3')
    heading.textContent = titulo

    const texto = document.createElement('p')
    texto.textContent = descripcion

    wrapper.appendChild(icono)
    wrapper.appendChild(heading)
    wrapper.appendChild(texto)

    return wrapper
}

function crearPlaceholderImagen(texto) {
    const titulo = String(texto || 'Oferta').slice(0, 28)

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
            <defs>
                <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="#3a2a16" />
                    <stop offset="100%" stop-color="#140f0a" />
                </linearGradient>
                <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="#f1d08a" stop-opacity="0.28" />
                    <stop offset="100%" stop-color="#f1d08a" stop-opacity="0" />
                </linearGradient>
            </defs>
            <rect width="800" height="500" fill="url(#bg)" />
            <circle cx="680" cy="60" r="160" fill="url(#shine)" />
            <circle cx="140" cy="420" r="150" fill="#c49a4a" fill-opacity="0.12" />
            <text x="60" y="255" fill="#f5edd8" font-family="Outfit, Arial, sans-serif" font-size="42" font-weight="600">${escapeHtml(titulo)}</text>
            <text x="60" y="305" fill="#c4b49a" font-family="Outfit, Arial, sans-serif" font-size="24">Imagen no disponible</text>
        </svg>
    `)}`
}

function escapeHtml(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}
