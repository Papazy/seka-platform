'use client'
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserRole } from "@/lib/enum";
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedLayout from '@/components/ProtectedLayout'
import { 
  UserCircleIcon, 
  KeyIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  AcademicCapIcon,
  IdentificationIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import toast from "react-hot-toast";

interface Fakultas {
  id: string;
  nama: string;
  kodeFakultas: string;
}

interface ProgramStudi {
  id: string;
  nama: string;
  kodeProdi: string;
  fakultas: Fakultas;
}
interface ProfileData {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  nip?: string;
  npm?: string;
  programStudi?: ProgramStudi;
  jabatan?: string;
}

export default function ProfilePage(){
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    nama: '',
    email: ''
  })
  const [isProfileUpdating, setIsProfileUpdating] = useState(false)
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfileData(data.user)
        setProfileForm({
          nama: data.user.nama,
          email: data.user.email
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProfileUpdating(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profileForm)
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.user)
        toast.success('Profile berhasil diperbarui!')
      } else {
        const error = await response.json()
        toast.success(error.error)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.success('Gagal memperbarui profile')
    } finally {
      setIsProfileUpdating(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.success('Password baru dan konfirmasi password tidak sama')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.success('Password baru minimal 6 karakter')
      return
    }

    setIsPasswordUpdating(true)

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          oldPassword: passwordForm.currentPassword,
          confirmPassword: passwordForm.confirmPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (response.ok) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        toast.success('Password berhasil diubah')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal mengubah password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Terjadi kesalahan saat mengubah password')
    } finally {
      setIsPasswordUpdating(false)
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { name: 'Administrator', color: 'bg-gray-100 text-gray-600', icon: '' }
      case 'LABORAN':
        return { name: 'Laboran', color: 'bg-gray-100 text-gray-600', icon: '' }
      case 'DOSEN':
        return { name: 'Dosen', color: 'bg-gray-100 text-gray-600', icon: '' }
      case 'MAHASISWA':
        return { name: 'Mahasiswa', color: 'bg-gray-100 text-gray-600', icon: '' }
      default:
        return { name: role, color: 'bg-gray-100 text-gray-600', icon: '' }
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if(isLoading) {
    return <LoadingSpinner/>
  }

  if(!profileData) {
    return (
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Profile tidak ditemukan</h1>
          </div>
        </div>
    )
  }

  const roleInfo = getRoleInfo(profileData.role)

  return (
    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-[#3ECF8E] to-[#2EBF7B] px-6 py-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-[#3ECF8E] text-3xl font-bold">
                  {profileData.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{profileData.nama}</h2>
                  <p className="text-white text-opacity-90">{profileData.email}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                      {roleInfo.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-[#3ECF8E] text-[#3ECF8E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserCircleIcon className="w-5 h-5 inline mr-2" />
                  Informasi Pribadi
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'password'
                      ? 'border-[#3ECF8E] text-[#3ECF8E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <KeyIcon className="w-5 h-5 inline mr-2" />
                  Keamanan
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-md font-medium text-gray-900">Informasi Pribadi</h3>
                  
                  {/* Profile Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {profileData.role === UserRole.DOSEN && profileData.nip && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <IdentificationIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">NIP</p>
                            <p className="text-sm text-gray-900">{profileData.nip}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {profileData.role === UserRole.DOSEN && profileData.jabatan && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <UserCircleIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Jabatan</p>
                            <p className="text-sm text-gray-900">{profileData.jabatan}</p>
                          </div>
                        </div>
                      </div>
                    )}
                                      
                    {profileData.role === UserRole.MAHASISWA && profileData.npm && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <IdentificationIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">NPM</p>
                            <p className="text-sm text-gray-900">{profileData.npm}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(profileData.role === UserRole.MAHASISWA || profileData.role === UserRole.DOSEN) && 
                      profileData.programStudi && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <AcademicCapIcon className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Program Studi</p>
                              <p className="text-sm text-gray-900">{profileData.programStudi.nama}</p>
                              <p className="text-xs text-gray-500">
                                {profileData.programStudi.fakultas.nama}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    
                    
                  </div>

                  {/* Edit Profile Form */}
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="nama"
                        value={profileForm.nama}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, nama: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm text-[#2da36e]"
                        required
                        disabled
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm text-[#2da36e]"
                        required
                        disabled
                      />
                    </div>

                    <div className="pt-4">
                      {/* <button
                        type="submit"
                        disabled={isProfileUpdating}
                        className="px-6 py-2 bg-[#3ECF8E] text-white rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProfileUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button> */}
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6">
                  <h3 className="text-md font-medium text-gray-900">Ubah Password</h3>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Password Lama
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => togglePasswordVisibility('current')}
                        >
                          {showPasswords.current ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Password Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPasswords.new ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPasswords.confirm ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isPasswordUpdating}
                        className="px-6 py-2 bg-[#3ECF8E] text-white rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPasswordUpdating ? 'Mengubah...' : 'Ubah Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}