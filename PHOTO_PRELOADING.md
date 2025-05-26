<!-- eslint-skip -->

# Photo Preloading Implementation

## Overview

This implementation adds intelligent photo preloading to the home page, automatically loading the first 10 latest photos after the home page is fully rendered. This improves user experience by making photo navigation faster while being mindful of bandwidth usage.

## Features

### 🏠 Home Page Detection
- Automatically detects when user is on the home page (`/`)
- Triggers photo preloading only after the page is fully rendered
- Uses multiple detection strategies for reliability

### 📸 Smart Photo Prefetching
- Prefetches the **first 10 latest photos** (sorted by timestamp, descending)
- Uses `prefetch` instead of `preload` to avoid browser warnings for future navigation
- Uses staggered loading (150ms intervals) to avoid overwhelming the browser
- Prevents duplicate prefetching with URL tracking
- Graceful error handling

### 🎯 Multiple Trigger Strategies
1. **Page Load Detection**: Waits for `document.readyState === 'complete'`
2. **Intersection Observer**: Detects when main content is 80% visible
3. **Fallback Timer**: Ensures preloading starts within 2 seconds

### 📊 Development Metrics
- Real-time preloading statistics in development mode
- Console logging for debugging
- Performance tracking for cache hit rates

## Implementation Details

### Core Files Modified

#### `src/components/UnifiedPreloader.vue`
Enhanced the existing preloader with photo preloading functionality:

```typescript
// New photo preloading function
async function preloadPhotos(reason: string) {
  const photosModule = await import('../../photos/data')
  const photos = photosModule.default
  const photosToPreload = photos.slice(0, 10) // First 10 latest photos
  
  // Staggered preloading with 150ms intervals
  photosToPreload.forEach((photo: any, index: number) => {
    setTimeout(() => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = photo.url
      link.as = 'image'
      document.head.appendChild(link)
    }, index * 150)
  })
}
```

#### Home Page Specific Logic
```typescript
function startHomePagePhotoPreloading() {
  if (route.path !== '/' || hasStartedPhotoPreload.value) return
  
  // Multiple detection strategies
  // 1. Page load + delay
  // 2. Intersection observer
  // 3. Fallback timer
}
```

### Photo Data Structure

Photos are automatically sorted by timestamp in descending order (latest first) in `photos/data.ts`:

```typescript
const photos = Array.from(imageMap.entries())
  .map(([name, url]): Photo => ({ ...metadata, name, url }))
  .sort((a, b) => b.name.localeCompare(a.name)) // Latest first
```

### Naming Convention

Photos follow the pattern: `p-YYYY-MM-DD-HH-MM-SS-mmm-N.webp`
- Example: `p-2025-05-24-04-50-23-000-1.webp`
- This ensures chronological sorting works correctly

## Testing

### Automated Testing
```bash
# Run the photo preloading test
pnpm photos:test
```

### Browser Testing
1. **Start Development Server**
   ```bash
   pnpm dev
   ```

2. **Open Browser Dev Tools** (F12)

3. **Navigate to Home Page** (`/`)

4. **Check Console Logs**
   Look for these messages:
   ```
   🏠 Home page fully loaded, starting photo preloading...
   📸 Starting photo prefetch: 10 photos (home-page-loaded) - will be cached for any future navigation
   📷 Prefetched photo 1/10: p-2025-05-24-04-50-23-000-1 (home-page-loaded) - cached for future navigation
   📷 Prefetched photo 2/10: p-2025-04-19-15-01-09-000-2 (home-page-loaded) - cached for future navigation
   ...
   ```

5. **Check Network Tab**
   - Filter by "Images"
   - Look for preloaded photos with `link rel="preload"`

6. **Check Metrics Display**
   - Bottom-right corner shows preloading statistics
   - Format: `Cache: X% | Nav: Y | Photos: Z`

## Performance Considerations

### Bandwidth Optimization
- **Staggered Loading**: 150ms intervals prevent bandwidth spikes
- **Limited Scope**: Only 10 photos (not all 87+ photos)
- **Smart Timing**: Only after page is fully rendered
- **Duplicate Prevention**: Tracks preloaded URLs

### User Experience
- **Zero Impact on Initial Load**: Preloading starts after page is ready
- **Faster Photo Navigation**: Photos load instantly when user visits `/photos`
- **Progressive Enhancement**: Works even if preloading fails

### Browser Compatibility
- Uses standard `<link rel="preload">` for maximum compatibility
- Intersection Observer with fallback for older browsers
- Graceful degradation if features are unavailable

## Configuration

### Adjusting Photo Count
To change the number of preloaded photos, modify the slice parameter:

```typescript
// In UnifiedPreloader.vue
const photosToPreload = photos.slice(0, 15) // Change from 10 to 15
```

### Adjusting Timing
To change the staggered loading interval:

```typescript
// In UnifiedPreloader.vue
}, index * 200) // Change from 150ms to 200ms
```

### Disabling Photo Preloading
To disable photo preloading while keeping route prefetching:

```typescript
// In UnifiedPreloader.vue, comment out or remove:
// if (route.path === '/') {
//   startHomePagePhotoPreloading()
// }
```

## Monitoring & Debugging

### Development Mode Features
- **Console Logging**: Detailed preloading progress
- **Metrics Display**: Real-time statistics
- **Error Reporting**: Graceful error handling with warnings

### Production Mode
- **Silent Operation**: No console logs in production
- **Metrics Disabled**: No visual indicators
- **Error Resilience**: Continues working even if some photos fail

### Debug Commands
```javascript
// In browser console (development mode)
window.__preloadingMetrics.getPreloadedPhotos()  // List preloaded photo URLs
window.__preloadingMetrics.getPhotoPreloadCount() // Get count of preloaded photos
window.__preloadingMetrics.getCacheHitRate()      // Get overall cache hit rate
```

## Integration with Existing System

### Route Prefetching
Photo preloading works alongside the existing route prefetching system:
- Routes are still prefetched based on user behavior
- Photo preloading is additive, not replacement
- Both systems share the same performance tracking

### Photo Gallery Components
The preloaded photos benefit these components:
- `PhotoGalleryAll` (main photos page)
- `PhotoGrid` (grid display component)
- `PhotoSlide` (slideshow component)

### Future Enhancements
Potential improvements:
1. **Adaptive Loading**: Adjust count based on connection speed
2. **Priority Hints**: Use `fetchpriority` for critical photos
3. **Lazy Preloading**: Preload more photos as user scrolls
4. **Cache Management**: Implement photo cache expiration

## Troubleshooting

### Common Issues

**Photos not preloading:**
- Check if you're on the home page (`/`)
- Verify console logs in development mode
- Check Network tab for preload requests

**Performance impact:**
- Reduce photo count in configuration
- Increase staggered loading interval
- Check if photos are too large

**Console errors:**
- Verify photos data is accessible
- Check photo URL validity
- Ensure proper TypeScript types

### Support
For issues or questions about the photo preloading implementation, check:
1. Browser console for error messages
2. Network tab for failed requests
3. Development metrics for performance data

## FAQ

### Q: Do prefetched photos persist if I navigate to other pages first?
**A: Yes!** Prefetched photos remain in browser cache regardless of navigation path:
- Home → Posts → Photos ✅ (photos still cached)
- Home → Projects → Photos ✅ (photos still cached)
- Any navigation sequence works ✅

### Q: Why use `prefetch` instead of `preload`?
**A:** `prefetch` is better for future navigation:
- No browser warnings about unused resources
- Lower priority than `preload` (doesn't compete with critical resources)
- Designed specifically for resources that might be needed later

### Q: How long do prefetched photos stay cached?
**A:** Typically 5-30 minutes, depending on:
- Available browser memory
- Cache size limits
- Other resource priorities
- Browser cache policies

### Q: Does this impact initial page load speed?
**A:** Minimal impact:
- Prefetching starts 800ms after page is fully loaded
- Uses low-priority `prefetch` (doesn't compete with critical resources)
- Staggered loading prevents bandwidth spikes 