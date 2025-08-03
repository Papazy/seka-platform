// components/forms/LaboranForm.tsx
'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface LaboranFormProps {
  laboran?: {
    id: string
    nama: string
    email: string
  }
  onSubmit: (data: { nama: string; email: string; password?: string }) => void
  onCancel: () => void
  isSubmitting?: boolean
  isEditing?: boolean
}

export default function LaboranForm({ 
  laboran, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  isEditing = false
}: LaboranFormProps) {
  const [formData, setFormData] = useState({
    nama: laboran?.nama || '',
    email: laboran?.email || '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
          placeholder="Masukkan email"
          required
        />
      </div>

      {!isEditing && (

        <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password {laboran && '(Kosongkan jika tidak ingin mengubah)'}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
            placeholder="Masukkan password"
            required={!laboran}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#3ECF8E] border border-transparent rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Menyimpan...' : laboran ? 'Perbarui' : 'Tambah'}
        </button>
      </div>
    </form>
  )
}