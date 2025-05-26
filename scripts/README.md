# Photo Processing Scripts

This directory contains scripts for managing and processing photos for the website.

## Scripts Overview

### 📸 `photos-manage-smart.ts`

**Main photo processor** - Converts new photos to optimized WebP format.

**Features:**

- Processes JPG, PNG, and HEIC files
- Converts to WebP with 85% quality
- Resizes to max 1440px (maintains aspect ratio)
- Auto-rotates based on EXIF data
- Strips metadata for privacy
- Uses timestamp-based naming: `p-YYYY-MM-DD-HH-MM-SS-mmm-N.webp`
- Only processes new photos (not starting with 'p-')
- Deletes original files after successful conversion

**Usage:**

```bash
npm run photos          # Process new photos
npm run photos:force    # Force process all photos
```

### 🔧 `img-compress.ts`

**Core utilities** - Shared compression functions with CLI interface.

**Features:**

- Sharp-based image processing
- EXIF data extraction and processing
- Configurable compression settings
- CLI interface for standalone use

**Usage:**

```bash
npm run compress:cli <input-file> [output-file]
```

### 🔄 `img-compress-staged.ts`

**Git integration** - Processes staged image files automatically.

**Features:**

- Integrates with Git pre-commit hooks
- Only processes staged image files
- Maintains Git workflow compatibility

**Usage:**

```bash
npm run compress        # Process staged files
```

## Workflow

### Adding New Photos

1. **Add photos** to the `photos/` directory (JPG, PNG, or HEIC)
2. **Run processing**: `npm run photos`
3. **Add metadata** (optional): Create `.json` files with same name
4. **Commit changes**: Git add and commit the WebP files

### Photo Metadata

Create JSON files with the same name as your photo (without extension):

```json
{
  "text": "Photo description",
  "lang": "en"
}
```

Example: `p-2024-01-01-12-00-00-000-1.json`

### File Naming Convention

- **Input**: Any filename (e.g., `IMG_1234.jpg`, `photo.png`)
- **Output**: `p-YYYY-MM-DD-HH-MM-SS-mmm-N.webp`
  - `p-` prefix for processed photos
  - Timestamp from EXIF or file modification time
  - Milliseconds for uniqueness
  - Sequential number for duplicates

## Configuration

### Quality Settings

- **WebP Quality**: 85% (good balance of size vs quality)
- **Max Dimensions**: 1440px (suitable for modern displays)
- **Format**: WebP only (97%+ browser support in Singapore)

### Processing Options

- **Auto-rotation**: Based on EXIF orientation
- **Metadata stripping**: Removes EXIF data for privacy
- **Progressive encoding**: For better loading experience

## Performance

### Typical Results

- **File size reduction**: 30-70% compared to original JPG
- **Processing speed**: ~37 photos/minute
- **Quality**: Visually lossless at 85% WebP quality

### Storage Benefits

- **Single format**: Eliminates format redundancy
- **Optimized compression**: WebP provides better compression than JPG
- **Consistent naming**: Timestamp-based organization

## Troubleshooting

### Common Issues

1. **Photos not processing**: Check if files start with 'p-' (already processed)
2. **EXIF errors**: Some photos lack metadata - script uses file timestamp as fallback
3. **Permission errors**: Ensure write access to photos directory
4. **Memory issues**: Large photos may require more memory - script processes one at a time

### Recovery

If photos are accidentally deleted:

```bash
git restore photos/filename.jpg  # Restore from Git
npm run photos                   # Re-process
```

## Integration

### Git Hooks

The scripts can be integrated with Git pre-commit hooks to automatically process photos when committing.

### Build Process

Photo processing is separate from the build process to avoid blocking deployments.

### Development

- Use `npm run photos` during development
- Processed photos are committed to Git for deployment
- No runtime processing needed
