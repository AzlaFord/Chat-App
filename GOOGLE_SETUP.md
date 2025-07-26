# Google Sign-In Setup Guide

## Current Status
✅ Environment file created (`.env.local`)
✅ JWT Secret generated and configured
✅ Login form improved with better error handling
✅ Date configuration moved to environment variables
✅ Google Client ID configured

## Next Steps

### 1. Get Your Google Client ID

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search for and enable "Google+ API" or "Google Identity API"
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. **Configure OAuth consent screen** (if prompted):
   - Choose "External" user type
   - Fill in required fields (App name, User support email, Developer contact)
6. **Set up OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Name: "Chat App" (or your preferred name)
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
7. **Copy the Client ID** (it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### 2. Environment Variables Configuration

Your `.env.local` file should contain:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
JWT_SECRET=68dce419b21b359b57b547118112cc031ecb853975abc979b94abe8b7b088ead97968c350bb14e302936b9f73ede368adc6c541ca03ccec643bacd31fee339c9

# Date Configuration
NEXT_PUBLIC_DATE_FORMAT=dd/MM/yyyy
NEXT_PUBLIC_MIN_BIRTH_YEAR=1900
NEXT_PUBLIC_LOCALE=en-US
```

**Date Configuration Options:**
- `NEXT_PUBLIC_DATE_FORMAT`: Date format for display (e.g., "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd")
- `NEXT_PUBLIC_MIN_BIRTH_YEAR`: Minimum year for birth date selection
- `NEXT_PUBLIC_LOCALE`: Locale for date formatting (e.g., "en-US", "es-ES", "fr-FR")

### 3. Restart Your Development Server

```bash
npm run dev
```

### 4. Test the Setup

1. Go to `http://localhost:3000/login`
2. You should see a Google Sign-In button instead of the error message
3. Click the button to test the Google Sign-In flow

## Troubleshooting

### If you still see "Google Sign-In not configured":
- Make sure you've updated both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` in `.env.local`
- Restart your development server after making changes
- Check the browser console for any error messages

### If Google Sign-In button doesn't appear:
- Check that the Google+ API is enabled in your Google Cloud Console
- Verify your OAuth consent screen is configured
- Make sure your authorized origins include `http://localhost:3000`

### For Production:
- Add your production domain to authorized origins in Google Cloud Console
- Update environment variables for production deployment
- Consider using environment-specific configuration files

## Date Configuration

The application now uses environment variables for date formatting configuration:

- **Date Format**: Configure how dates are displayed using `NEXT_PUBLIC_DATE_FORMAT`
- **Birth Year Range**: Set the minimum birth year with `NEXT_PUBLIC_MIN_BIRTH_YEAR`
- **Locale**: Configure date localization with `NEXT_PUBLIC_LOCALE`

### Example Date Formats:
- `dd/MM/yyyy` - European format (31/12/2023)
- `MM/dd/yyyy` - US format (12/31/2023)
- `yyyy-MM-dd` - ISO format (2023-12-31)
- `dd MMM yyyy` - Short month (31 Dec 2023)

### Example Locales:
- `en-US` - English (US)
- `es-ES` - Spanish
- `fr-FR` - French
- `de-DE` - German

## Security Notes

- Keep your `.env.local` file secure and never commit it to version control
- The JWT secret should be kept confidential
- Google Client IDs are safe to expose in client-side code (that's why we use `NEXT_PUBLIC_` prefix)
- Date configuration variables are safe to expose as they only affect display formatting 