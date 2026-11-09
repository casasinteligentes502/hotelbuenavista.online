(() => {
  'use strict';

  const SETTINGS = window.HBV_CONFIG || {};
  const WA_NUMBER = SETTINGS.whatsApp || '50257598151';
  const isEN = document.documentElement.lang.toLowerCase().startsWith('en');
  const assetPrefix = document.body.dataset.assets || 'assets/img/';
  const copy = isEN ? {
    openMenu:'Open menu',closeMenu:'Close menu',missing:'Please choose arrival and departure dates.',dates:'Check-out must be after check-in.',
    ok:'Your WhatsApp message is ready. Please send it to the hotel to inquire about availability.',
    people:'guests',one:'guest', any:'Any option', alpine:'Alpine cabin', family:'Family cabin',couple:'Couples room',
    missingName:'Enter your full name.', invalidPhone:'Enter a valid phone number, with country code if needed (8 to 15 digits).'
  } : {
    openMenu:'Abrir menú',closeMenu:'Cerrar menú',missing:'Selecciona las fechas de tu visita.',dates:'La salida debe ser posterior a la llegada.',
    ok:'Se preparó tu consulta en WhatsApp. Envíala al hotel para confirmar disponibilidad.',
    people:'personas',one:'persona',any:'Cualquier opción', alpine:'Cabaña alpina',family:'Cabaña familiar',couple:'Habitación para parejas',
    missingName:'Escribe tu nombre completo.', invalidPhone:'Ingresa un número de teléfono válido, con código de país si corresponde (de 8 a 15 dígitos).'
  };
  // Persist one accessible visual theme across both language pages.
  const root = document.documentElement;
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('hbv-theme'); } catch(_) {}
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = mode => {
    root.setAttribute('data-theme', mode);
    const b = document.querySelector('.theme-toggle');
    if (b) {
      b.setAttribute('aria-pressed', String(mode === 'dark'));
      b.setAttribute('aria-label', mode === 'dark' ? (isEN ? 'Switch to light theme':'Cambiar a tema claro') : (isEN ? 'Switch to dark theme':'Cambiar a tema oscuro'));
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.content = mode === 'dark' ? '#14271d' : '#1f352b';
  };
  setTheme((savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : (systemDark ? 'dark':'light'));
  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const mode = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(mode);
    try { localStorage.setItem('hbv-theme', mode); } catch(_) {}
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const serviceCopy = isEN ? {
    kicker:'HOTEL BUENA VISTA SERVICES',
    empty:'There are no photos available for this service yet.',
    close:'Close gallery',
    prev:'Previous photo',
    next:'Next photo',
    count:(index,total)=>`Photo ${index} of ${total}`
  } : {
    kicker:'SERVICIOS DE HOTEL BUENA VISTA',
    empty:'Todavía no hay fotografías disponibles para este servicio.',
    close:'Cerrar galería',
    prev:'Foto anterior',
    next:'Siguiente foto',
    count:(index,total)=>`Fotografía ${index} de ${total}`
  };

  // Navegación adaptable
  const header = $('.site-header');
  const mobileButton = $('.mobile-menu-btn');
  const navigation = $('#navigation');
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    mobileButton.setAttribute('aria-expanded', 'false');
    mobileButton.setAttribute('aria-label', copy.openMenu);
    mobileButton.innerHTML = '<svg class="icon"><use href="#i-menu"></use></svg>';
    document.body.classList.remove('menu-open');
  };
  mobileButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    mobileButton.setAttribute('aria-expanded', String(open));
    mobileButton.setAttribute('aria-label', open ? copy.closeMenu : copy.openMenu);
    mobileButton.innerHTML = `<svg class="icon"><use href="${open ? '#i-close' : '#i-menu'}"></use></svg>`;
    document.body.classList.toggle('menu-open', open);
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 1080) closeMenu(); });
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Carrusel principal: control manual y cambio suave, sin dependencias
  const slides = $$('.hero-slide');
  const dots = $$('.hero-dot');
  let slideIndex = 0;
  const showSlide = index => {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === slideIndex));
    dots.forEach((dot, i) => {
      const active = i === slideIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
  };
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
  // Autoplay can be paused manually, on hover, keyboard focus and reduced motion.
  let slideshowPaused = reducedMotion;
  let heroInteractionPaused = false;
  const hero = $('.hero');
  const pauseBtn = $('.hero-pause');
  const updatePauseButton = () => {
    if (!pauseBtn) return;
    pauseBtn.setAttribute('aria-pressed', String(slideshowPaused));
    pauseBtn.textContent = slideshowPaused ? (isEN ? 'Resume ▶' : 'Reanudar ▶') : (isEN ? 'Pause Ⅱ' : 'Pausar Ⅱ');
    pauseBtn.setAttribute('aria-label', slideshowPaused ? (isEN ? 'Resume slideshow' : 'Reanudar carrusel') : (isEN ? 'Pause slideshow' : 'Pausar carrusel'));
  };
  updatePauseButton();
  pauseBtn?.addEventListener('click', () => { slideshowPaused = !slideshowPaused; updatePauseButton(); });
  hero?.addEventListener('mouseenter', () => { heroInteractionPaused = true; });
  hero?.addEventListener('mouseleave', () => { heroInteractionPaused = false; });
  hero?.addEventListener('focusin', () => { heroInteractionPaused = true; });
  hero?.addEventListener('focusout', event => { if (!hero.contains(event.relatedTarget)) heroInteractionPaused = false; });
  if (slides.length > 1) {
    window.setInterval(() => { if (!document.hidden && !slideshowPaused && !heroInteractionPaused) showSlide(slideIndex + 1); }, 6500);
  }

  // Reserva informativa por WhatsApp: no procesa pagos ni confirma disponibilidad.
  const bookingForm = $('#booking-form');
  const arrival = $('#fecha-llegada');
  const departure = $('#fecha-salida');
  const guests = $('#huespedes');
  const customerName = $('#nombre-completo');
  const customerPhone = $('#telefono-contacto');
  const message = $('#booking-message');
  const customerContactFields = [customerName, customerPhone];
  customerContactFields.forEach(el => el?.addEventListener('input', () => {
    el.removeAttribute('aria-invalid');
    message.textContent = '';
  }));
  // Selecting an accommodation takes guests to the same personalized inquiry.
  $$('.stay-action[data-select-lodging]').forEach(link => {
    link.addEventListener('click', () => {
      $('#tipo-alojamiento').value = link.dataset.selectLodging || '';
    });
  });
  const asLocalISO = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const fromISO = value => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const prettyDate = value => fromISO(value).toLocaleDateString(isEN ? 'en-US':'es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
  const today = asLocalISO(new Date());
  arrival.min = today;
  departure.min = today;
  arrival.addEventListener('change', () => {
    if (!arrival.value) return;
    const nextDay = fromISO(arrival.value);
    nextDay.setDate(nextDay.getDate() + 1);
    departure.min = asLocalISO(nextDay);
    if (departure.value && departure.value < departure.min) departure.value = '';
    message.textContent = '';
  });
  departure.addEventListener('change', () => { message.textContent = ''; });
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    message.textContent = '';
    message.style.color = '';
    message.style.background = '';
    if (!arrival.value || !departure.value) {
      message.textContent = copy.missing;
      (!arrival.value ? arrival : departure).focus();
      return;
    }
    if (arrival.value < today || departure.value <= arrival.value) {
      message.textContent = copy.dates;
      departure.focus();
      return;
    }
    const name = customerName.value.trim().replace(/\s+/g, ' ');
    const phone = customerPhone.value.trim().replace(/\s+/g, ' ');
    const phoneDigits = phone.replace(/\D/g, '');
    if (name.length < 3 || !name.includes(' ')) {
      message.textContent = copy.missingName;
      customerName.setAttribute('aria-invalid', 'true');
      customerName.focus();
      return;
    }
    if (!/^[+0-9()\s.\-]+$/.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
      message.textContent = copy.invalidPhone;
      customerPhone.setAttribute('aria-invalid', 'true');
      customerPhone.focus();
      return;
    }
    const people = guests.value === '1' ? `1 ${copy.one}` : (guests.value === '8 o más' ? (isEN ? '8 or more guests' : '8 o más personas') : `${guests.value} ${copy.people}`);
    const lodging = $('#tipo-alojamiento').value;
    const preferred = copy[lodging] || copy.any;
    const text = isEN ? [
      'Hello, Hotel Buena Vista! 🌿',
      'I would like to check availability for a stay.',
      `👤 Full name: ${name}`,
      `📱 Contact phone: ${phone}`,
      `📅 Check-in: ${prettyDate(arrival.value)}`,
      `📅 Check-out: ${prettyDate(departure.value)}`,
      `👥 Guests: ${people}`,
      `🏡 Preferred lodging: ${preferred}`,
      'Could you please confirm available options and rates? Thank you!'
    ].join('\n') : [
      '¡Hola, Hotel Buena Vista! 🌿',
      'Me gustaría consultar disponibilidad para una estadía.',
      `👤 Nombre completo: ${name}`,
      `📱 Teléfono de contacto: ${phone}`,
      `📅 Llegada: ${prettyDate(arrival.value)}`,
      `📅 Salida: ${prettyDate(departure.value)}`,
      `👥 Huéspedes: ${people}`,
      `🏡 Alojamiento deseado: ${preferred}`,
      '¿Podrían indicarme las opciones disponibles y sus tarifas? Muchas gracias.'
    ].join('\n');
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    // Navigate in the same tab as the submit click; pop-up blockers on iPhone cannot block a new window.
    // Do not show a false 'sent' or 'ready' success state: WhatsApp is responsible for sending the message.
    message.textContent = isEN ? 'Opening WhatsApp to send your enquiry…' : 'Abriendo WhatsApp para enviar tu consulta…';
    window.location.assign(url);
  });

  // Galería ampliable con navegación por teclado.
  const galleryData = $$('.gallery-tile').map(tile => {
    const image = $('img', tile);
    return [tile.dataset.fullSrc || image?.getAttribute('src') || '', image?.alt || ''];
  });
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxCaption = $('#lightbox-caption');
  let galleryIndex = 0;
  let previouslyFocused = null;
  const renderLightbox = () => {
    const [url, caption] = galleryData[galleryIndex] || ['', ''];
    lightboxImage.src = url;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
  };
  const openLightbox = index => {
    galleryIndex = index;
    previouslyFocused = document.activeElement;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    $('.lightbox-close').focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  };
  const moveLightbox = direction => {
    galleryIndex = (galleryIndex + direction + galleryData.length) % galleryData.length;
    renderLightbox();
  };
  $$('.gallery-tile').forEach(button => button.addEventListener('click', () => openLightbox(Number(button.dataset.galleryIndex))));
  $('.lightbox-close').addEventListener('click', closeLightbox);
  $('.lightbox-prev').addEventListener('click', () => moveLightbox(-1));
  $('.lightbox-next').addEventListener('click', () => moveLightbox(1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
    if (event.key === 'Tab') {
      const controls = [$('.lightbox-close'), $('.lightbox-prev'), $('.lightbox-next')];
      const i = controls.indexOf(document.activeElement);
      if (event.shiftKey && i === 0) { event.preventDefault(); controls.at(-1).focus(); }
      if (!event.shiftKey && i === controls.length - 1) { event.preventDefault(); controls[0].focus(); }
    }
  });


  // One source of truth for temporary prices. Do not publish expired/unconfirmed rates.
  const isCurrentPromo = offer => Boolean(offer && offer.confirmed === true && /^\d{4}-\d{2}-\d{2}$/.test(offer.validUntil || '') && new Date(`${offer.validUntil}T23:59:59`).getTime() >= Date.now());
  const formatMoney = amount => `Q${Number(amount).toLocaleString('en-US')}`;
  const seasonal = SETTINGS.seasonal || {};
  const validSeasonal = isCurrentPromo(seasonal);
  const offerNames = isEN ? {romantic:'romantic room',alpine:'alpine cabin',family:'family cabin'} : {romantic:'habitación romántica',alpine:'cabaña alpina',family:'cabaña familiar'};
  $$('.offer-card[data-offer-id]').forEach(card => {
    const id = card.dataset.offerId;
    const price = seasonal.rooms?.[id];
    const rate = $('[data-offer-rate]', card);
    const tag = $('.offer-tag', card);
    const CTA = $('[data-offer-cta]', card);
    if (validSeasonal && Number(price) > 0) {
      if (rate) rate.textContent = formatMoney(price) + (isEN ? ' / one night' : ' / una noche');
      if (tag) tag.textContent = (isEN ? 'Valid until ' : 'Válida hasta ') + seasonal.validUntil;
    }
    const name = offerNames[id] || id;
    const msg = isEN
      ? `Hello Hotel Buena Vista, I would like to ask about the ${name}. ${validSeasonal && Number(price)>0 ? `I saw a seasonal price of ${formatMoney(price)} valid until ${seasonal.validUntil}.` : 'Please send me the current prices and dates.'} Could you confirm availability and the conditions?`
      : `Hola Hotel Buena Vista, quisiera información sobre ${name}. ${validSeasonal && Number(price)>0 ? `Vi la promoción de ${formatMoney(price)} válida hasta ${seasonal.validUntil}.` : 'Por favor indíquenme tarifas y fechas actuales.'} ¿Pueden confirmarme disponibilidad y condiciones?`;
    if (CTA) CTA.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  });
  const bbq = SETTINGS.bbq || {};
  const bbqPrice = $('[data-bbq-price]');
  const bbqCTA = $('[data-bbq-cta]');
  if (bbqPrice && isCurrentPromo(bbq) && Number(bbq.price)>0) {
    bbqPrice.textContent = `${formatMoney(bbq.price)} / ${isEN ? 'person' : 'persona'}`;
  }
  if (bbqCTA) {
    const msg = isEN
      ? `Hello Hotel Buena Vista, I would like to ask about the barbecue package, its current price, availability and inclusions.${isCurrentPromo(bbq) ? ` I saw a ${formatMoney(bbq.price)} per person offer valid until ${bbq.validUntil}.` : ''}`
      : `Hola Hotel Buena Vista, quisiera consultar el paquete de asado, su precio actual, disponibilidad e inclusiones.${isCurrentPromo(bbq) ? ` Vi el precio de ${formatMoney(bbq.price)} por persona válido hasta ${bbq.validUntil}.` : ''}`;
    bbqCTA.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  // Galería modal para las fotografías de servicios, sin salir de la página.
  const serviceAlbums = $$('.service-album');
  if (serviceAlbums.length) {
    const modal = document.createElement('div');
    modal.className = 'service-gallery';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-label', isEN ? 'Service photo gallery' : 'Galería de fotografías de servicios');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
    modal.innerHTML = `
      <div class="service-gallery-panel">
        <button aria-label="${serviceCopy.close}" class="service-close" type="button"><svg class="icon"><use href="#i-close"></use></svg></button>
        <div class="service-gallery-head">
          <span class="service-kicker">${serviceCopy.kicker}</span>
          <h2 class="service-gallery-title"></h2>
          <p class="service-gallery-description"></p>
        </div>
        <div class="service-gallery-photo-area">
          <button aria-label="${serviceCopy.prev}" class="service-prev" type="button"><svg class="icon"><use href="#i-arrow-left"></use></svg></button>
          <div class="service-photo-stage" hidden>
            <img alt="" class="service-gallery-image"/>
            <div class="service-photo-caption"></div>
          </div>
          <div class="service-empty" hidden>
            <span class="service-empty-art"><svg class="icon"><use href="#i-eye"></use></svg></span>
            <p>${serviceCopy.empty}</p>
          </div>
          <button aria-label="${serviceCopy.next}" class="service-next" type="button"><svg class="icon"><use href="#i-arrow"></use></svg></button>
        </div>
        <div class="service-gallery-bottom">
          <div class="service-gallery-count"></div>
          <a class="service-gallery-cta" href="#" rel="noopener noreferrer" target="_blank">
            <span class="service-gallery-cta-label"></span>
            <svg class="icon"><use href="#i-arrow-up"></use></svg>
          </a>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const serviceTitle = $('.service-gallery-title', modal);
    const serviceDescription = $('.service-gallery-description', modal);
    const serviceStage = $('.service-photo-stage', modal);
    const serviceImage = $('.service-gallery-image', modal);
    const serviceCaption = $('.service-photo-caption', modal);
    const serviceEmpty = $('.service-empty', modal);
    const serviceCount = $('.service-gallery-count', modal);
    const serviceCta = $('.service-gallery-cta', modal);
    const serviceCtaLabel = $('.service-gallery-cta-label', modal);
    const servicePrev = $('.service-prev', modal);
    const serviceNext = $('.service-next', modal);
    const serviceClose = $('.service-close', modal);
    const serviceFocusable = () => [serviceClose, servicePrev, serviceNext, serviceCta].filter(node => node && !node.hidden && !node.disabled && !node.hasAttribute('hidden'));

    let activeAlbum = null;
    let activePhotoIndex = 0;
    let previousServiceFocus = null;

    const getAlbumData = album => {
      const photos = $$('.service-album-photo', album).map(anchor => {
        const img = $('img', anchor);
        const label = $('span', anchor);
        const caption = (img?.alt || label?.textContent || '').replace(/\s*[·|\-–—].*$/, '').trim();
        return {
          src: anchor.getAttribute('href') || img?.getAttribute('src') || '',
          alt: img?.alt || caption,
          caption: caption || img?.alt || ''
        };
      }).filter(item => item.src);
      const cta = $('.service-album-wa', album);
      return {
        title: $('h3', album)?.textContent.trim() || '',
        description: $('.service-album-desc', album)?.textContent.trim() || '',
        ctaHref: cta?.href || `https://wa.me/${WA_NUMBER}`,
        ctaLabel: cta?.textContent.trim() || (isEN ? 'Ask on WhatsApp ↗' : 'Consultar por WhatsApp ↗'),
        photos
      };
    };

    const renderServicePhoto = () => {
      if (!activeAlbum) return;
      serviceTitle.textContent = activeAlbum.title;
      serviceDescription.textContent = activeAlbum.description;
      serviceCta.href = activeAlbum.ctaHref;
      serviceCtaLabel.textContent = activeAlbum.ctaLabel.replace(/\s*[↗]+\s*$/, '');
      const total = activeAlbum.photos.length;
      if (!total) {
        serviceStage.hidden = true;
        serviceEmpty.hidden = false;
        serviceCount.textContent = '';
        servicePrev.hidden = true;
        serviceNext.hidden = true;
        return;
      }
      const item = activeAlbum.photos[activePhotoIndex];
      serviceImage.src = item.src;
      serviceImage.alt = item.alt;
      serviceCaption.textContent = item.caption;
      serviceCount.textContent = serviceCopy.count(activePhotoIndex + 1, total);
      serviceStage.hidden = false;
      serviceEmpty.hidden = true;
      servicePrev.hidden = total < 2;
      serviceNext.hidden = total < 2;
    };

    const openServiceGallery = (albumNode, index = 0, opener = null) => {
      activeAlbum = getAlbumData(albumNode);
      activePhotoIndex = index;
      previousServiceFocus = opener || document.activeElement;
      renderServicePhoto();
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      serviceClose.focus();
    };

    const closeServiceGallery = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      if (previousServiceFocus && previousServiceFocus.focus) previousServiceFocus.focus();
    };

    const moveServiceGallery = direction => {
      if (!activeAlbum || activeAlbum.photos.length < 2) return;
      activePhotoIndex = (activePhotoIndex + direction + activeAlbum.photos.length) % activeAlbum.photos.length;
      renderServicePhoto();
    };

    $$('.service-album-photo').forEach(anchor => {
      anchor.addEventListener('click', event => {
        event.preventDefault();
        const albumNode = anchor.closest('.service-album');
        const list = $$('.service-album-photo', albumNode);
        openServiceGallery(albumNode, Math.max(0, list.indexOf(anchor)), anchor);
      });
    });

    // Service tiles open their albums immediately, instead of scrolling to a distant section.
    $$('.amenity-trigger[href^="#fotos-"]').forEach(trigger => {
      trigger.addEventListener('click', event => {
        const id = trigger.getAttribute('href').slice(1);
        const album = document.getElementById(id);
        if (!album) return; // Native anchor continues to work without JavaScript.
        event.preventDefault();
        openServiceGallery(album, 0, trigger);
      });
    });

    serviceClose.addEventListener('click', closeServiceGallery);
    servicePrev.addEventListener('click', () => moveServiceGallery(-1));
    serviceNext.addEventListener('click', () => moveServiceGallery(1));
    modal.addEventListener('click', event => {
      if (event.target === modal) closeServiceGallery();
    });

    document.addEventListener('keydown', event => {
      if (!modal.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeServiceGallery();
      if (event.key === 'ArrowLeft') moveServiceGallery(-1);
      if (event.key === 'ArrowRight') moveServiceGallery(1);
      if (event.key === 'Tab') {
        const nodes = serviceFocusable();
        if (!nodes.length) return;
        const currentIndex = nodes.indexOf(document.activeElement);
        if (event.shiftKey && currentIndex === 0) {
          event.preventDefault();
          nodes.at(-1).focus();
        }
        if (!event.shiftKey && currentIndex === nodes.length - 1) {
          event.preventDefault();
          nodes[0].focus();
        }
      }
    });
  }

  // Aparición progresiva y resaltado de sección en navegación.
  const revealNodes = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .11, rootMargin: '0px 0px -20px 0px' });
    revealNodes.forEach(node => revealObserver.observe(node));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const current = `#${entry.target.id}`;
        $$('.nav-links a[href^="#"]').forEach(link => link.classList.toggle('nav-active', link.getAttribute('href') === current));
      });
    }, { rootMargin: '-30% 0px -58% 0px' });
    $$('#inicio, #nosotros, #alojamientos, #experiencias, #galeria, #ubicacion').forEach(node => sectionObserver.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('is-visible'));
  }

  $('#year').textContent = new Date().getFullYear();
})();
