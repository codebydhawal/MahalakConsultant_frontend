
# Mahalak Consultants - Final Deployment Guide

Aapki premium portfolio website ab cloud-ready hai. Ise final deploy karne ke liye ye steps follow karein:

## Step 1: GitHub par Upload
1. GitHub par ek naye repository banayein.
2. Saari files ko upload karke "Commit" kar dein.

## Step 2: Netlify Connectivity (Deployment)
1. Netlify par jayein aur "Import from GitHub" karein.
2. **Site Configuration > Environment variables** mein jayein.
3. Niche di gayi Keys add karein:
   - `SUPABASE_URL`: (Supabase dashboard se)
   - `SUPABASE_ANON_KEY`: (Supabase dashboard se)
   - `ADMIN_ID`: (Staff ID jo aap use karenge)
   - `ADMIN_PASS`: (Staff password jo aap use karenge)
   - `API_KEY`: (Google Gemini Key AI Advisor ke liye)

## Step 3: Database Setup
`Supabase_Setup.txt` file mein diye gaye SQL script ko Supabase SQL Editor mein chalaein. Iske bina data cloud par save nahi hoga.

## Technical Support Note:
- **Frozen UI**: Layout ya design change karne ke liye developer ko explicitly notify karein.
- **Security**: Card details server par kabhi save nahi hoti. WhatsApp Gateway is actively secured.
- **Database**: App automatically offline-first kaam karegi agar internet slow hai.

**Admin Staff Portal:** `#/admin` 
**Current Fallback Admin:** `admin` / `admin123` (Change this in Environment Variables immediately after deployment).
