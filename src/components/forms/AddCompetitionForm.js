// src/components/forms/AddCompetitionForm.js
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../services/supabaseClient'
import { addCompetition } from '../../services/api'
import '../../styles/AddCompetitionForm.css'
import { FiFileText, FiFile } from 'react-icons/fi'

const DOC_TITLES = {
  protocol: 'Стартовый протокол',
  regulation: 'Положение',
  other: 'Другая информация'
}

export default function AddCompetitionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    create_news: false
  })
  const [docs, setDocs] = useState({
    protocol: null,
    regulation: null,
    other: null
  })
  const [status, setStatus] = useState(null)
  const queryClient = useQueryClient()

  // Функция, которая создаёт соревнование и все документы
  const mutation = useMutation({
    mutationFn: async ({ formData, docs }) => {
      // 1) создаём соревнование
      const { data: comp, error: compErr } = await supabase
        .from('competitions')
        .insert([formData])
        .select('id')
        .single()
      if (compErr) throw compErr
      const compId = comp.id

      // 2) для каждого загруженного файла заливаем в Storage и готовим запись
      const toInsert = []
      for (const key of Object.keys(docs)) {
        const file = docs[key]
        if (!file) continue

        const path = `documents/${Date.now()}_${file.name}`
        const { data: upData, error: upErr } = await supabase
          .storage.from('documents')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (upErr) throw upErr

        const { data: urlData, error: urlErr } = await supabase
          .storage.from('documents')
          .getPublicUrl(upData.path)
        if (urlErr) throw urlErr

        toInsert.push({
          title: DOC_TITLES[key],
          file_url: urlData.publicUrl,
          competition_id: compId
        })
      }

      // 3) добавляем документы в БД
      if (toInsert.length > 0) {
        const { error: docsErr } = await supabase
          .from('documents')
          .insert(toInsert)
        if (docsErr) throw docsErr
      }

      return comp
    },
    onMutate: async ({ formData }) => {
      await queryClient.cancelQueries({ queryKey: ['competitions'] })
      const previous = queryClient.getQueryData(['competitions']) || []
      const tempId = `temp-${Date.now()}`
      queryClient.setQueryData(['competitions'], [
        ...previous,
        { id: tempId, ...formData }
      ])
      return { previous }
    },
    onError: (err, data, ctx) => {
      queryClient.setQueryData(['competitions'], ctx.previous)
      setStatus({ success: false, message: err.message })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] })
    },
    onSuccess: () => {
      setStatus({ success: true, message: 'Соревнование и документы созданы!' })
      setFormData({
        title: '',
        date: '',
        location: '',
        description: '',
        create_news: false
      })
      setDocs({ protocol: null, regulation: null, other: null })
      if (onSuccess) onSuccess()
    }
  })

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(fd => ({
      ...fd,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileSelect = slot => e => {
    const file = e.target.files[0] || null
    setDocs(d => ({ ...d, [slot]: file }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setStatus(null)
    const { title, date, location } = formData
    if (!title || !date || !location) {
      setStatus({ success: false, message: 'Заполните обязательные поля.' })
      return
    }
    mutation.mutate({ formData, docs })
  }

  return (
    <form className="add-comp-form" onSubmit={handleSubmit}>
      <h2>Добавить соревнование и документы</h2>

      <div className="add-comp-fields">
        <label>
          Название*<br />
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Дата*<br />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Место*<br />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Описание<br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label className="checkbox-label">
          <input
            name="create_news"
            type="checkbox"
            checked={formData.create_news}
            onChange={handleChange}
          /> Авто-новость
        </label>
      </div>

      <div className="docs-slots">
        {['protocol', 'regulation', 'other'].map(slot => {
          const file = docs[slot];
          const title = DOC_TITLES[slot];
          // получаем расширение
          const ext = file?.name.split('.').pop().toLowerCase();

          let preview;
          if (file && ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) {
            // если картинка — показываем превью
            preview = (
              <img
                src={URL.createObjectURL(file)}
                alt={title}
                className="slot-img"
              />
            );
          } else if (file && ['pdf', 'txt', 'doc', 'docx', 'rtf'].includes(ext)) {
            // для pdf, txt, doc(x) и т. п. — иконка текста
            preview = <FiFileText size={32} />;
          } else if (file) {
            // другие бинарные форматы — общая иконка
            preview = <FiFile size={32} />;
          } else {
            // пока нет файла — плюсик
            preview = <span className="slot-plus">+</span>;
          }

          return (
            <label key={slot} className="doc-slot">
              {preview}
              <input
                type="file"
                accept="
                      .png, .jpg, .jpeg, .gif, .bmp, 
                      .webp,
                      .svg,
                      .pdf,
                      .doc, .docx,
                      .xls, .xlsx,
                      .ppt, .pptx,
                      .txt,
                      .rtf,
                      .csv,
                      .zip, .rar,
                    "
                onChange={handleFileSelect(slot)}
              />
              <div className="slot-label">{title}</div>
            </label>
          );
        })}
      </div>

      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Сохраняем…' : 'Сохранить всё'}
      </button>

      {status && (
        <div className={`status ${status.success ? 'ok' : 'error'}`}>
          {status.message}
        </div>
      )}
    </form>
  )
}
