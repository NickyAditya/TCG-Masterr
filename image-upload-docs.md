# Image Upload Feature Documentation

The card management system now includes support for direct image uploads through the admin interface. Instead of manually entering image paths, you can now upload images directly.

## Setup Requirements

To use the image upload feature, you need to install the `multer` package:

```bash
cd backend
npm install multer --save
```

## How It Works

1. In the Card Management section of Admin Dashboard, when adding or editing a card:
   - Click "Select Image" to choose an image file from your device
   - Click "Upload Image" to upload the selected file
   - The image will be automatically stored in the appropriate category folder

2. Images are stored in the frontend's public directory based on card category:
   - Pokémon cards: `/frontend/public/images/cards/pokemon/`
   - Yu-Gi-Oh! cards: `/frontend/public/images/cards/yugioh/`
   - Magic: The Gathering cards: `/frontend/public/images/cards/mtg/`

## Technical Details

- Supports common image formats (JPG, PNG, GIF, etc.)
- 5MB file size limit
- Automatically generates unique filenames to prevent conflicts
- Creates category folders if they don't exist
- Shows image preview before and after upload

## Troubleshooting

If you experience issues with file uploads:

1. Make sure the `multer` package is installed
2. Verify the backend server has write permissions to the frontend/public directory
3. Check that the folders in `/frontend/public/images/cards/` exist and are writable
