# Nina-Web — Progress Tracker

> **INSTRUCCIÓN PARA AUTO-CONTINUACIÓN:**
> Al iniciar una nueva sesión de trabajo, leer este archivo primero.
> El campo "Próximo paso" indica exactamente dónde continuar.

_Última actualización: 2026-02-27_
_Próximo paso: **Tests de integración E2E** — Verificar flujo completo: login → dashboard → publicar vacante → suscribir → ver contacto_

---

## BLOQUE A — Backend (D:\proyectos\nina\Backend)

- [x] `services/mp_service.py` — Fix crítico: guard `ValueError` en `int(external_ref)` (línea 44)
- [x] `models/long_term.py` — Modelos SQLAlchemy: LongTermVacancy, LongTermNannyAvailability, WebSubscription
- [x] `schemas/long_term.py` — Schemas Pydantic para validación
- [x] `services/long_term_service.py` — Lógica de negocio completa (vacantes, disponibilidad, suscripciones)
- [x] `api/long_term_router.py` — 10 endpoints REST bajo `/long-term`
- [x] `api/subscription_webhook_router.py` — Webhook `/webhook/mp-subscription`
- [x] `config.py` — Vars: SUBSCRIPTION_AMOUNT_ARS, WEB_*_URL, MP_SUBSCRIPTION_WEBHOOK_URL
- [x] `main.py` — Imports + migraciones SQL + registro de routers
- [x] `.env` — ALLOWED_ORIGINS actualizado con nina-web y localhost:5173
- [x] **Backend deployado en Render** — `/long-term/vacancies` y `/long-term/nannies` retornan datos reales

## BLOQUE B — Frontend Infraestructura (D:\proyectos\web_nina\src)

- [x] `lib/api.js` — VITE_API_URL env var + método `patch`
- [x] `.env` — VITE_API_URL=https://nina-app.com.ar
- [x] `components/ui/Modal.jsx` — Modal genérico con overlay + Esc
- [x] `components/ui/Carousel.jsx` — Carrusel horizontal con snap y flechas
- [x] `hooks/useSubscription.js` — Estado de suscripción + función subscribe()

## BLOQUE C — Componentes Dashboard

- [x] `components/dashboard/NannyCard.jsx`
- [x] `components/dashboard/FamilyVacancyCard.jsx`
- [x] `components/dashboard/SubscriptionModal.jsx`
- [x] `components/dashboard/VacancyModal.jsx`
- [x] `components/dashboard/AvailabilityModal.jsx`

## BLOQUE D — Páginas

- [x] `pages/dashboard/FamilyDashboard.jsx`
- [x] `pages/dashboard/NannyDashboard.jsx`
- [x] `pages/PaymentResult.jsx`

## BLOQUE E — Integración Auth

- [x] `App.jsx` — Rutas dashboard + RoleDashboard guard + PublicRoute redirect
- [x] `pages/auth/LoginPage.jsx` — useEffect que redirige al dashboard post-login
- [x] `pages/auth/CreateProfilePage.jsx` — Fix field mapping + redirect post-submit

## BLOQUE F — Infraestructura Proyecto

- [x] `PROGRESS.md` — Este archivo
- [x] **Git init + múltiples commits** — historial completo en master
- [x] **GitHub repo "nina-web" pusheado** — https://github.com/Mati312020/nina-web

---

## Tests de Integración

- [x] `GET /long-term/vacancies` — retorna 3 vacantes reales con datos de familias
- [x] `GET /long-term/nannies` — retorna 1 niñera (Lorena, 5 años exp., rating 4.43)
- [x] Datos de contacto son `null` sin suscripción activa ✓ (verificado en respuesta API)
- [ ] `POST /long-term/subscribe` retorna `checkout_url`
- [ ] Webhook `/webhook/mp-subscription` activa suscripción
- [ ] Datos de contacto visibles post-suscripción
- [ ] Login → redirige a `/dashboard/family` o `/dashboard/nanny`
- [ ] `PaymentResult` outcome=success → polling de suscripción

---

## Arquitectura clave para recordar

- **Auth:** `auth_id` es el UUID de Supabase, se pasa como query param (no JWT header)
- **Backend URL:** `https://nina-app.com.ar` (mismo que nina-app)
- **DB:** Supabase PostgreSQL compartida (mismo proyecto que nina-app)
- **Webhook bookings:** `/webhook/mp` (external_ref = "123")
- **Webhook suscripciones:** `/webhook/mp-subscription` (external_ref = "sub:123")
- **Suscripción:** 2000 ARS / 30 días → desbloquea phone+email en list endpoints
- **ARCA:** Infraestructura lista en backend (tabla invoices, invoice_service.py STUB)

---

## Issues conocidos / Notas

- El `SUBSCRIPTION_AMOUNT_ARS` en `.env` del backend se puede cambiar sin redeploy de código
- El polling en `PaymentResult` hace hasta 4 intentos cada 3s para verificar el webhook
- El carrusel oculta la scrollbar via `scrollbarWidth: none` (CSS)
- `NannyDashboard` usa `GET /long-term/nanny-availability/mine` que retorna `{}` si no hay entrada activa
- `MobileAuthCallback` (`/auth/mobile-callback`) es relay OAuth para nina-app: recibe `?code=&app_redirect=exp://` y redirige al deep link
- Los banners "Info" fueron movidos DENTRO del contenedor `max-w-6xl` (fix layout full-width)
