// src/services/api.js

import { supabase } from './supabaseClient';


// === PROFILES ===
export async function fetchProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabase.auth.user().id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(changes) {
  // changes = { chip_number?, phone?, team_id?, birthdate? }
  const uid = supabase.auth.user().id;
  const { data, error } = await supabase
    .from('profiles')
    .update(changes)
    .eq('id', uid)
    .single();
  if (error) throw error;
  return data;
}

// === TRAINER APPLICATIONS ===
export async function applyTrainerApplication() {
  const uid = supabase.auth.user().id;
  const { data, error } = await supabase
    .from('trainer_applications')
    .insert([{ user_id: uid }])
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMyApplications() {
  const uid = supabase.auth.user().id;
  const { data, error } = await supabase
    .from('trainer_applications')
    .select('*')
    .eq('user_id', uid)
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Для админа:
export async function fetchAllApplications() {
  const { data, error } = await supabase
    .from('trainer_applications')
    .select('*, profiles(name)')  // или какие поля нужны
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function reviewApplication(id, { status, note }) {
  const uid = supabase.auth.user().id; // админ
  const { data, error } = await supabase
    .from('trainer_applications')
    .update({ status, note, reviewed_at: new Date().toISOString(), admin_id: uid })
    .eq('id', id)
    .single();
  if (error) throw error;
  // если approved, меняем роль в profiles:
  if (status === 'approved') {
    await supabase
      .from('profiles')
      .update({ role: 'trainer' })
      .eq('id', data.user_id);
  }
  return data;
}


/** СОРЕВНОВАНИЯ */
export async function fetchCompetitions() {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchCompetition(id) {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function addCompetition(payload) {
  // payload = { title, date, location, description, create_news }
  const { data, error } = await supabase
    .from('competitions')
    .insert([payload])
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCompetition(id) {
  const { error } = await supabase
    .from('competitions')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/** НОВОСТИ */
export async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchNewsItem(id) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function addNews(payload) {
  // payload = { title, content, competition_id }
  const { data, error } = await supabase
    .from('news')
    .insert([payload])
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/** ДОКУМЕНТЫ */
export async function fetchDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchDocument(id) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchDocumentsByNew(id) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('news_id', id)
  if (error) throw error;
  return data;
}

export async function fetchDocumentsByCompetition(id) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('competition_id', id)
  if (error) throw error;
  return data;
}

export async function addDocument(payload) {
  // payload = { title, file_url, competition_id, news_id }
  const { data, error } = await supabase
    .from('documents')
    .insert([payload])
    .single();
  if (error) throw error;
  return data;
}

export async function updateDocument(id, patch) {
  // patch = partial fields to update
  const { data, error } = await supabase
    .from('documents')
    .update(patch)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(id) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/** КЛУБЫ */
export async function fetchClubs() {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchClub(id) {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function addClub(payload) {
  // payload = { name, description, region, contacts }
  const { data, error } = await supabase
    .from('clubs')
    .insert([payload])
    .single();
  if (error) throw error;
  return data;
}

export async function deleteClub(id) {
  const { error } = await supabase
    .from('clubs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/** МАТЕРИАЛЫ */
export async function fetchMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchMaterial(id) {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function addMaterial(payload) {
  // payload = { title, description, category, file_url }
  const { data, error } = await supabase
    .from('materials')
    .insert([payload])
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMaterial(id) {
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/** КАЛЕНДАРЬ (если понадобится) */
export async function fetchEvents() {
  // условно: возвращает массив соревнований с датами
  return fetchCompetitions();
}
