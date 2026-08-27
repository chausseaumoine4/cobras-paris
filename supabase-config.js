"use strict";
const supabaseUrl = "https://ibevkzarssjfxmxcuhga.supabase.co";
const supabaseKey = "sb_publishable_9hCdD6B-j6y6cgAA2iW5kw_OY3WIy7O";
const cobrasDb = window.supabase.createClient(supabaseUrl, supabaseKey);
window.cobrasCloud = {
  async load(key, fallback) {
    const { data, error } = await cobrasDb.from("site_content").select("content_data").eq("content_key", key).maybeSingle();
    if (error) throw error;
    return data ? data.content_data : fallback;
  },
  async save(key, value) {
    const { error } = await cobrasDb.from("site_content").upsert({ content_key: key, content_data: value, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
  auth: cobrasDb.auth
};
