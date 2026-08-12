
# Mahalak Consultants - Final Deployment Guide

Aapki premium portfolio website ab cloud-ready hai. Ise final deploy karne ke liye ye steps follow karein:

## Step 1: GitHub par Upload
1. GitHub par ek naye repository banayein.
2. Saari files ko upload karke "Commit" kar dein.

## Step 2: Netlify Connectivity (Deployment)
1. Netlify par jayein aur "Import from GitHub" karein.
2. **Site Configuration > Environment variables** mein jayein.
3. Agar use ho rahi hon to ye Keys add karein:
   - `ADMIN_ID`: (Staff ID jo aap use karenge)
   - `ADMIN_PASS`: (Staff password jo aap use karenge)
   - `API_KEY`: (Google Gemini Key AI Advisor ke liye)

## Technical Support Note:
- **Frozen UI**: Layout ya design change karne ke liye developer ko explicitly notify karein.
- **Security**: Card details server par kabhi save nahi hoti. WhatsApp Gateway is actively secured.
- **Data**: Is frontend mein Supabase connection nahi hai.

**Admin Staff Portal:** `#/admin` 
**Current Fallback Admin:** `admin` / `admin123` (Change this in Environment Variables immediately after deployment).
