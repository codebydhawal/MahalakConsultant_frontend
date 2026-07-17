
import { createClient } from '@supabase/supabase-js';

// Prioritize Netlify Environment Variables, fallback to placeholders if not set
const supabaseUrl = (process.env.SUPABASE_URL || 'https://vlatulvloscnillqkwvv.supabase.co').trim(); 
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXR1bHZsb3NjbmlsbHFrd3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTQ4MDAsImV4cCI6MjA4MzM3MDgwMH0.Yc76AX14WOXa-0m_0EFXJJcXZy1XZbjNPfPQRM7ezBo').trim(); 

// Setting persistSession to false bypasses browser tracking prevention blocks
const supabase = (supabaseUrl && supabaseUrl.includes('supabase.co') && supabaseAnonKey && supabaseAnonKey.length > 20) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null;

export const fetchAll = async (table: string) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
      if (!error && data) {
        localStorage.setItem(`mahalak_${table}`, JSON.stringify(data));
        return data;
      }
      if (error) console.debug(`Supabase fetch failed for ${table}:`, error.message);
    } catch (e) {
      console.debug(`Network error fetching ${table}. Using local data.`);
    }
  }

  const localData = localStorage.getItem(`mahalak_${table}`);
  return localData ? JSON.parse(localData) : null;
};

export const upsertItem = async (table: string, item: any) => {
  let cloudSuccess = false;

  if (supabase) {
    try {
      const { error } = await supabase.from(table).upsert(item);
      if (error) throw error;
      
      cloudSuccess = true;
      // Refresh local cache from cloud for total sync
      const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
      if (data) {
        localStorage.setItem(`mahalak_${table}`, JSON.stringify(data));
        return data;
      }
    } catch (e: any) {
      const msg = e.message === 'Failed to fetch' 
        ? "Cloud Connection Blocked: Supabase tak pahunch nahi paa rahe (Network Error)." 
        : e.message;
      
      const proceedLocal = window.confirm(`${msg}\n\nKya aap ise sirf apne browser (LocalStorage) mein save karna chahte hain?\n(Note: Ye live website par update nahi hoga).`);
      if (!proceedLocal) throw new Error("Cloud sync failed and user cancelled local save.");
    }
  } else {
    const proceedLocal = window.confirm("Cloud Database connected nahi hai. Kya aap locally save karna chahte hain?");
    if (!proceedLocal) throw new Error("Cloud not connected and user cancelled save.");
  }

  // Local Fallback (Only if Cloud failed but user said 'Yes')
  const existing = JSON.parse(localStorage.getItem(`mahalak_${table}`) || '[]');
  const index = existing.findIndex((i: any) => i.id === item.id);
  let updated;
  if (index >= 0) {
    updated = [...existing];
    updated[index] = item;
  } else {
    updated = [item, ...existing];
  }
  localStorage.setItem(`mahalak_${table}`, JSON.stringify(updated));
  return updated;
};

export const deleteItemById = async (table: string, id: number) => {
  if (supabase) {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
      if (data) {
        localStorage.setItem(`mahalak_${table}`, JSON.stringify(data));
        return data;
      }
    } catch (e: any) {
      const proceedLocal = window.confirm(`Cloud Delete Fail: ${e.message}\n\nKya ise locally delete karein?`);
      if (!proceedLocal) throw new Error("Delete operation cancelled.");
    }
  }

  const existing = JSON.parse(localStorage.getItem(`mahalak_${table}`) || '[]');
  const updated = existing.filter((i: any) => i.id !== id);
  localStorage.setItem(`mahalak_${table}`, JSON.stringify(updated));
  return updated;
};

export const fetchConfig = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_config').select('*').single();
      if (!error && data) {
        localStorage.setItem('mahalak_config', JSON.stringify(data));
        return data;
      }
    } catch (e) {
      // Silent fail for config reading
    }
  }
  const localConfig = localStorage.getItem('mahalak_config');
  return localConfig ? JSON.parse(localConfig) : null;
};

export const upsertConfig = async (config: any) => {
  if (supabase) {
    try {
      const { error } = await supabase.from('site_config').upsert({ ...config, id: 1 });
      if (error) throw error;
    } catch (e: any) {
      const proceedLocal = window.confirm(`Branding Sync Error: ${e.message}\n\nLocal browser mein settings apply karein?`);
      if (!proceedLocal) throw new Error("Configuration sync cancelled.");
    }
  }
  localStorage.setItem('mahalak_config', JSON.stringify(config));
  return config;
}
