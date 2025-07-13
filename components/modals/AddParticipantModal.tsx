// components/modals/AddParticipantModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface User {
  id: number
  nama: string
  identifier: string // npm/nip
  email: string
  programStudi?: {
    nama: string
    kodeProdi: string
  }
  jabatan?: string
}

interface AddParticipantModalProps {
  isOpen: boolean
  onClose: () => void
  handleAddParticipants: (data: any) => void
  type: 'peserta' | 'asisten' | 'dosen'
  praktikumId: number
}

export function AddParticipantModal({
  isOpen,
  onClose,
  handleAddParticipants,
  type,
  praktikumId
}: AddParticipantModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (searchTerm.length >= 2 && searchResults.length === 0) {
      searchUsers()
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const searchUsers = async () => {
    try {
      setSearching(true)
      const endpoint = type === 'dosen' ? '/api/dosen/search' : '/api/mahasiswa/search'
      const response = await fetch(
        `${endpoint}?q=${searchTerm}&exclude_praktikum=${praktikumId}`,
        { credentials: 'include' }
      )
      
      if (response.ok) {
        const result = await response.json()
        const formatedData = result.data.map((user: any) => ({
          id: user.id,
          nama: user.nama,
          identifier: type === 'dosen' ? user.nip : user.npm,
          email: user.email,
          programStudi: user.programStudi || undefined,
          jabatan: user.jabatan || undefined
        }))
        setSearchResults(formatedData)
      } else {
        toast.error('Gagal mencari data')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mencari data')
    } finally {
      setSearching(false)
    }
  }

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
      setSearchTerm('')
      setSearchResults([])
    }
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId))
  }

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Pilih minimal satu peserta')
      return
    }

    setLoading(true)
    try {
      const userIds = selectedUsers.map(u => u.id)
      await handleAddParticipants({ userIds })
      
      // Reset form
      setSelectedUsers([])
      setSearchTerm('')
      setSearchResults([])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedUsers([])
    setSearchTerm('')
    setSearchResults([])
    onClose()
  }

  const getTitle = () => {
    switch (type) {
      case 'peserta': return 'Tambah Peserta'
      case 'asisten': return 'Tambah Asisten'
      case 'dosen': return 'Tambah Dosen'
      default: return 'Tambah Peserta'
    }
  }

  const getSearchPlaceholder = () => {
    switch (type) {
      case 'peserta': return 'Cari mahasiswa berdasarkan NPM atau nama...'
      case 'asisten': return 'Cari mahasiswa berdasarkan NPM atau nama...'
      case 'dosen': return 'Cari dosen berdasarkan NIP atau nama...'
      default: return 'Cari...'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari {type === 'dosen' ? 'Dosen' : 'Mahasiswa'}
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 focus:outline-none focus:bg-blue-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex">
                        <p className="font-medium text-gray-900 text-sm">{user.nama}  </p> <p className='font-medium text-gray-600 text-sm'>• {user.identifier}</p>
                      </div>
                      <div className="flex">
                      <p className="text-xs text-gray-500">{user.email}  </p>

                      {user.programStudi && (
                        <p className="text-xs text-gray-400">• {user.programStudi.nama}</p>
                      )}
                      {user.jabatan && (
                        <p className="text-xs text-gray-400">• {user.jabatan}</p>
                      )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

        

          {searching && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3ECF8E] mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Mencari...</p>
            </div>
          )}
          {/* No Results */}
          {searchTerm.length >= 2 && searchResults.length === 0 && !searching && (
            <div className="text-center py-4">
              <p className="text-sm h-5 w-full text-gray-500 mt-2 mx-auto">Tidak ada hasil</p>
              <p className="text-xs text-gray-400 mt-2">*Periksa apakah mahasiswa sudah bergabung</p>
            </div>
          )}

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'dosen' ? 'Dosen' : 'Mahasiswa'} Terpilih ({selectedUsers.length})
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.nama}</p>
                      <p className="text-xs text-gray-500">{user.identifier}</p>
                    </div>
                    <Button
                      onClick={() => handleRemoveUser(user.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || selectedUsers.length === 0}
              className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                `Tambah ${selectedUsers.length} ${type === 'dosen' ? 'Dosen' : 'Mahasiswa'}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}