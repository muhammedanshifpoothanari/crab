# CrabsCart Project Redesign Documentation

This document outlines the redesign implementation, caching architecture, SEO best practices, geolocation features, and a list of modified files.

---

## 1. Project Redesign Overview
The CrabsCart platform has been redesigned to align with a hyperlocal savings, vouchers, and rewards model inspired by the Magicpin user experience (magicpin.in). 
- **Theme**: Vibrant magenta-pink brand colors (`#ec2652`).
- **Features**: Structured coupon/voucher deal cards, dynamic geolocation discovery, auto-complete search results, and database read caching.

---

## 2. Completed Files Registry

### Created Files
1. **[cache.ts](file:///Users/muhammedanshifp/Desktop/crab/crab/lib/cache.ts)**: Server-side in-memory caching helper with expiration TTL (5 minutes default) and global scoping support to lower database read costs.
2. **[bottom-nav.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/bottom-nav.tsx)**: Sticky mobile navigation bar rendering links for Home, Categories, Wishlist, Orders, and Account.
3. **[features.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/features.tsx)**: Grid element highlighting store values: Free Shipping, Secure Payment, Easy Returns, and 24/7 Support.
4. **[footer-promo.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/footer-promo.tsx)**: Magicpin app download badge and marketing block.
5. **[category-deals.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/category-deals.tsx)**: Category-grouped voucher tracks in horizontal scrolling lists.

### Modified Files
1. **[globals.css](file:///Users/muhammedanshifp/Desktop/crab/crab/app/globals.css)**: Colors updated to signature magenta-pink (`#ec2652`).
2. **[layout.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/app/layout.tsx)**: Integrated global announcement `TopBanner` and sticky mobile `BottomNav` components.
3. **[page.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/app/page.tsx)**: Homepage structured with dynamic Hero sliders, Category tracks, and app download blocks.
4. **[navbar.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/navbar.tsx)**: Integrated geolocation selector, functional autocomplete search engine dropdown, and header links.
5. **[hero.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/hero.tsx)**: Redesigned slide template. Fetches structured dynamic banners (tags, headers, descriptions, side-images) from the database or falls back to standard presets.
6. **[categories.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/categories.tsx)**: Remapped circular categories scroller for mobile viewports.
7. **[products.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/products.tsx)**: Redesigned e-commerce cards to serve as vouchers (discount badges, points rewards, claim CTAs) and synchronized wishlist selections with `localStorage`.
8. **[footer.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/components/footer.tsx)**: Adjusted floating WhatsApp icon's coordinates on mobile screens to sit above the navigation bar.
9. **[product/[id]/page.tsx](file:///Users/muhammedanshifp/Desktop/crab/crab/app/product/%5Bid%5D/page.tsx)**: Dynamic metadata (SEO) added, alongside try-catch database fallbacks to local product files on connection errors.
10. **[api/products/route.ts](file:///Users/muhammedanshifp/Desktop/crab/crab/app/api/products/route.ts)**: Added server caching, CDN headers, write invalidation, and db fallbacks.
11. **[api/collections/route.ts](file:///Users/muhammedanshifp/Desktop/crab/crab/app/api/collections/route.ts)**: Added cache utilities, HTTP headers, write invalidation, and fallback arrays.
12. **[api/banners/route.ts](file:///Users/muhammedanshifp/Desktop/crab/crab/app/api/banners/route.ts)** & **[[id]/route.ts](file:///Users/muhammedanshifp/Desktop/crab/crab/app/api/banners/%5Bid%5D/route.ts)**: Custom banner schema updates (`tag`, `header`, `description`, `image`, `link`, `isActive`) with in-memory caching, CDN headers, and CRUD invalidation.

---

## 3. SEO Guidance & Best Practices
To optimize search engine discoverability and click-through rates, the platform implements the following SEO parameters:

### Metadata Configuration
- **Dynamic Metadata**: Individually generated via Next.js `generateMetadata` function inside dynamic routes (e.g. `/product/[id]/page.tsx`).
- **Required SEO tags**:
  - **Meta Title**: `<title>` tag should be concise (50-60 characters) and include the product name + target keywords + brand identifier (e.g., `Classic Wedding Cake Topper - Custom Collectibles | CrabsCart`).
  - **Meta Description**: A summary (150-160 characters) including product descriptions and a strong call-to-action (e.g. *"Buy custom wedding figurines..."*).
  - **Open Graph (OG) Tags**: Crucial for social sharing previews. Configures dynamic `og:title`, `og:description`, and `og:image` attributes.

### Best Practices for Content Editors:
1. **Alt Attributes**: Always provide descriptive text inside the `alt` property of all `<Image />` elements to assist image search visibility.
2. **Heading Hierarchies**: Maintain a single semantic `<h1>` tag per page for main headings, followed by `<h2>` and `<h3>` tags in order.
3. **Structured Schema Markup**: For product detail pages, consider adding JSON-LD structured schemas (`ld+json`) describing reviews, pricing, and availability.

---

## 4. Geo-location (GEO) Integration
- **Mechanism**: Utilizes standard HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`).
- **Process**: On header load, coordinates are requested. A reverse-geocoding call is made to OpenStreetMap's Nominatim endpoint to parse the corresponding city and state (e.g. *"Karunagappally, Kerala"*), which is automatically pre-selected in the location widget.
- **Fallback**: Defaults safely to *"Karunagappally, Kerala"* if browser geolocation permissions are denied.

---

## 5. DB Cache Layer Architecture
- **In-Memory Cache-Aside**: Queries are intercepted by `getCache` checks in the API routes. On cache-miss, data is loaded from MongoDB, cached for 300 seconds, and returned.
- **Write-Through Invalidation**: When any creation, modification, or deletion (POST/PUT/DELETE) is executed on products or banners, the corresponding cache key is instantly deleted (`invalidateCache`) to ensure page views pull the fresh database state.
- **HTTP Cache Control**: Read queries return `Cache-Control` header `public, max-age=60, s-maxage=60, stale-while-revalidate=600`, delegating edge CDN servers to caching responses.
