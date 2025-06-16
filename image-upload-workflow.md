# TCG Master Card Image Upload Workflow

## Overview

The card image upload feature allows administrators to upload card images when adding or editing TCG cards. The images are automatically uploaded to the appropriate category folder (`pokemon`, `yugioh`, or `mtg`) when saving a card.

## How It Works

1. **Image Selection**:
   - In the Add/Edit Card modal, click on "Select Image" to choose an image file from your device
   - Once selected, you'll see a preview of the image and the filename

2. **Automatic Upload Process**:
   - When you click "Add Card" or "Update Card", the image is automatically uploaded
   - The system uploads the image to the correct folder based on the selected game category
   - The image path is stored in the `image` column of the `cards` table in the database
   - No separate upload button is needed

3. **Folder Structure**:
   - Images are stored in `frontend/public/images/cards/{category}` where category is:
     - `pokemon` for Pokémon cards
     - `yugioh` for Yu-Gi-Oh! cards
     - `mtg` for Magic: The Gathering cards

## Technical Implementation

### Backend

- Uses Multer middleware to handle file uploads
- The upload route (`/api/uploads`) processes the image and moves it to the correct category folder
- Returns the relative file path that's stored in the database

### Frontend

- The card form automatically handles image uploads as part of the card save process
- No separate upload button is required
- The upload happens in the `handleSubmit` function of the CardManagement component

## Error Handling

- If the image upload fails, the card will still be saved without an image
- Error messages are displayed to inform the user about upload issues
- Success messages are shown when uploads complete successfully

## Requirements

- Multer package for handling multipart form data (installed via `npm install multer`)
- Appropriate folder permissions to allow writing to the image directories
