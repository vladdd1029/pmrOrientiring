// src/services/api.js

import { supabase } from './supabaseClient';


// src/services/api.js
/**
 * Возвращает текущий user.id, или кидает ошибку, если не залогинен
 */
async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Пользователь не авторизован');
  return data.user.id;
}

/** ПРОФИЛИ */
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, changes) {
  const { data, error } = await supabase
    .from('profiles')
    .update(changes)
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/** ЗАЯВКИ ТРЕНЕРОВ */
export async function applyTrainerApplication(userId) {
  const { data, error } = await supabase
    .from('trainer_applications')
    .insert([{ user_id: userId }])
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMyApplications(userId) {
  const { data, error } = await supabase
    .from('trainer_applications')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Для админа:
// src/services/api.js

export async function fetchAllApplications() {
  const { data, error } = await supabase
    .from('trainer_applications')
    .select(`
      *,
      user:profiles!trainer_applications_user_id_fkey(
        id,
        first_name,
        last_name,
        middle_name,
        email,
        team_id
      ),
      club:clubs!profiles_team_id_fkey(
        id,
        name
      )
    `)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data;
}


export async function reviewApplication(applicationId, { status, note }) {
  const adminId = await getCurrentUserId();

  // 1) Обновляем заявку и сразу запрашиваем все поля
  const { data: app, error: reviewError } = await supabase
    .from('trainer_applications')
    .update(
      {
        status,
        note,
        reviewed_at: new Date().toISOString(),
        admin_id: adminId
      },
      { returning: 'representation' }  // <- опционально для явного возврата
    )
    .eq('id', applicationId)
    .select('*')                       // <- добавляем select
    .single();                         // <- и single

  if (reviewError) throw reviewError;

  // 2) Если одобрена — меняем роль профиля тренера
  if (status === 'approved') {
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: 'trainer' })
      .eq('id', app.user_id);
    if (roleError) throw roleError;
  }

  return app;
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
