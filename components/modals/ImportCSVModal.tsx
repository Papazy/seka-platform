// components/modals/ImportCSVModal.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  DocumentArrowUpIcon, 
  DocumentArrowDownIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ImportCSVModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title: string
  endpoint: string
  templateEndpoint: string
  sampleData: any[]
  columns: { key: string; label: string }[]
}

export function ImportCSVModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  endpoint,
  templateEndpoint,
  sampleData,
  columns
}: ImportCSVModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      previewFile(selectedFile)
      setShowPreview(true)
    }
  }

  const previewFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target?.result as string
      const lines = csv.split('\n').filter(line => line.trim() !== '')
      
      if (lines.length === 0) {
        toast.error('File CSV kosong')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      // Process all data lines, not just first 5
      const data = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const obj: any = { _rowNumber: index + 2 } // +2 karena baris 1 adalah header
        headers.forEach((header, headerIndex) => {
          obj[header] = values[headerIndex] || ''
        })
        return obj
      }).filter(row => {
        // Filter out completely empty rows
        const values = Object.values(row).filter(val => val !== '' && val !== row._rowNumber)
        return values.length > 0
      })
      
      setPreview(data)
      
      if (data.length === 0) {
        toast.error('Tidak ada data valid dalam file CSV')
      } else {
        toast.success(`File berhasil dimuat: ${data.length} baris data`)
      }
    }
    reader.readAsText(file)
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(templateEndpoint, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `template_${title.toLowerCase().replace(/\s+/g, '_')}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Template berhasil diunduh!')
      } else {
        toast.error('Gagal mengunduh template')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengunduh template')
    }
  }

  const handleImport = async () => {
    if (!file) return

    setUploading(true)
    setErrors([])

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Import berhasil! ${result.imported} data berhasil diimpor.`)
        if (result.errors && result.errors.length > 0) {
          setErrors(result.errors)
          toast.warning(`Ada ${result.errors.length} error yang perlu diperhatikan`)
        } else {
          onSuccess()
          resetModal()
        }
      } else {
        setErrors(result.errors || [result.error])
        toast.error('Import gagal, periksa error di bawah')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat import')
    } finally {
      setUploading(false)
    }
  }

  const resetModal = () => {
    setFile(null)
    setPreview([])
    setErrors([])
    setShowPreview(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="!max-w-[70vw] max-h-[95vh] w-full overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center">
            <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Template Download & Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center">
              📋 Template & Instruksi CSV
            </h3>
              <div>
                <p className="text-sm text-blue-700 mb-3">
                  Unduh template CSV untuk memastikan format yang benar
                </p>
                <Button
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  Unduh Template
                </Button>
              </div>
             
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih File CSV
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#3ECF8E] transition-colors">
              <div className="space-y-1 text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#3ECF8E] hover:text-[#2EBF7B] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#3ECF8E]">
                    <span>Upload file CSV</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">atau drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">File CSV maksimal 10MB</p>
              </div>
            </div>
            
            {file && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      📄 {file.name}
                    </p>
                    <p className="text-xs text-green-700">
                      Ukuran: {(file.size / 1024 / 1024).toFixed(2)} MB | 
                      Data: {preview.length} baris
                    </p>
                  </div>
                  {/* <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {showPreview ? 'Sembunyikan' : 'Lihat'} Preview
                  </Button> */}
                </div>
              </div>
            )}
          </div>

          {/* Preview Data - Full Width & All Data */}
          {showPreview && preview.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-900 flex items-center">
                  Preview Data ({preview.length} baris)
                </h3>
              </div>
              
              {/* Scrollable Table Container */}
              <div className="overflow-auto max-h-96" style={{ maxHeight: '400px' }}>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                        #
                      </th>
                      {columns.map(col => (
                        <th 
                          key={col.key} 
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r whitespace-nowrap"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 border-r font-mono">
                          {index + 1}
                        </td>
                        {columns.map(col => (
                          <td key={col.key} className="px-3 py-2 border-r">
                            <div className="max-w-32 truncate text-gray-900" title={row[col.key] || '-'}>
                              {row[col.key] || (
                                <span className="text-gray-400 italic">kosong</span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {preview.length > 10 && (
                <div className="bg-gray-50 px-4 py-2 border-t text-center">
                  <p className="text-xs text-gray-600">
                    💡 Menampilkan semua {preview.length} baris data. Scroll untuk melihat lebih banyak.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sample Data */}
          {/* {!file && sampleData.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                📝 Contoh Format Data
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-white">
                    <tr>
                      {columns.map(col => (
                        <th key={col.key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleData.map((row, index) => (
                      <tr key={index}>
                        {columns.map(col => (
                          <td key={col.key} className="px-3 py-2 whitespace-nowrap text-gray-900 border">
                            {row[col.key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                {/* <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" /> */}
                <h3 className="font-medium text-red-900">
                  ❌ Error saat import ({errors.length} error):
                </h3>
              </div>
              <div className="max-h-40 overflow-y-auto">
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="flex">
                      <span className="text-red-500 mr-2">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {errors.length > 5 && (
                <p className="text-xs text-red-600 mt-2 italic">
                  💡 Perbaiki error di atas, lalu coba import ulang
                </p>
              )}
            </div>
          )}
        </div>

        {/* Fixed Actions at Bottom */}
        <div className="flex-shrink-0 flex justify-end space-x-3 pt-4 border-t">
          <Button
            onClick={resetModal}
            variant="outline"
            disabled={uploading}
          >
            Batal
          </Button>
          
          {/* {errors.length > 0 && (
            <Button
              onClick={() => {
                onSuccess()
                resetModal()
              }}
              variant="outline"
              className="text-green-600 hover:text-green-700"
            >
              Lanjutkan Tanpa Import
            </Button>
          )} */}
          
          <Button
            onClick={handleImport}
            disabled={!file || uploading || preview.length === 0}
            className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importing {preview.length} data...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Import {preview.length} Data
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}