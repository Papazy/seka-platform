'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAsistenSoalSubmissions, useUpdateSubmissionScore } from '@/hooks/useAsistenSoalSubmissions'

export default function AsistenSubmissions({ praktikumId, tugasId, soalId }: { praktikumId: string, tugasId: string, soalId: string }) {
  const { data: submissions = [], isLoading } = useAsistenSoalSubmissions(praktikumId, tugasId, soalId)
  const [selectedPesertaId, setSelectedPesertaId] = useState<string | null>(null)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const updateScore = useUpdateSubmissionScore(praktikumId, tugasId, soalId)
  const [editScore, setEditScore] = useState<number | null>(null)

  // Best submission per peserta
  const bestSubmissions = getBestSubmissions(submissions)

  // Submission peserta yang dipilih
  const pesertaSubmissions = selectedPesertaId
    ? submissions.filter(s => s.peserta.id === selectedPesertaId)
    : []

  // Submission detail yang dipilih
  const submissionDetail = submissions.find(s => s.id === selectedSubmissionId)

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Best Submission Peserta</h2>
      {isLoading ? (
        <div className="overflow-x-auto border rounded-lg mb-8">
          <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Peserta</th>
            <th className="px-4 py-2">NPM</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Waktu</th>
            <th className="px-4 py-2">Bahasa</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((_, idx) => (
            <tr key={idx} className="border-b animate-pulse">
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-300 rounded w-12"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      ) : bestSubmissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Belum ada submission</div>
      ) : (
        <div className="overflow-x-auto border rounded-lg mb-8">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Peserta</th>
                <th className="px-4 py-2">NPM</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Waktu</th>
                <th className="px-4 py-2">Bahasa</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bestSubmissions.map((s: any) => (
                <tr key={s.id} className="border-b hover:bg-green-50 cursor-pointer">
                  <td className="px-4 py-2">{s.peserta.nama}</td>
                  <td className="px-4 py-2">{s.peserta.npm}</td>
                  <td className="px-4 py-2">{s.score}</td>
                  <td className="px-4 py-2">{new Date(s.submittedAt).toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2">{s.bahasa.nama}</td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedPesertaId(s.peserta.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Lihat Submission
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabel seluruh submission peserta */}
      {selectedPesertaId && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold">Submission Peserta</h3>
            <Button size="sm" onClick={() => { setSelectedPesertaId(null); setSelectedSubmissionId(null); }}>
              Kembali ke Best Submission
            </Button>
          </div>
          <table className="min-w-full text-sm border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Waktu</th>
                <th className="px-4 py-2">Bahasa</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pesertaSubmissions.map((s: any) => (
                <tr key={s.id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-2">{s.id}</td>
                  <td className="px-4 py-2">{s.score}</td>
                  <td className="px-4 py-2">{new Date(s.submittedAt).toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2">{s.bahasa.nama}</td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedSubmissionId(s.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail submission */}
      {selectedSubmissionId && submissionDetail && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold">Detail Submission</h3>
            <Button size="sm" onClick={() => setSelectedSubmissionId(null)}>
              Kembali ke Submission Peserta
            </Button>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="mb-2">
              <span className="font-semibold">Bahasa:</span> {submissionDetail.bahasa.nama}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Score:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={editScore !== null ? editScore : submissionDetail.score}
                onChange={e => setEditScore(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
                disabled={updateScore.isPending}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (editScore !== null && editScore !== submissionDetail.score) {
                    updateScore.mutate({ submissionId: submissionDetail.id, score: editScore })
                  }
                }}
                disabled={updateScore.isPending || editScore === null || editScore === submissionDetail.score}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updateScore.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Waktu Submit:</span> {new Date(submissionDetail.submittedAt).toLocaleString('id-ID')}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Source Code:</span>
              <pre className="bg-gray-900 text-gray-100 rounded p-3 mt-2 overflow-x-auto text-xs">
                <code>{submissionDetail.sourceCode}</code>
              </pre>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Test Case Result</h4>
            <table className="min-w-full text-xs border rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1">#</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Output</th>
                  <th className="px-2 py-1">Waktu</th>
                  <th className="px-2 py-1">Memori</th>
                </tr>
              </thead>
              <tbody>
                {submissionDetail.testCaseResult.map((tc: any, idx: number) => (
                  <tr key={tc.id} className={tc.status === 'ACCEPTED' ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-2 py-1">{idx + 1}</td>
                    <td className="px-2 py-1">{tc.status}</td>
                    <td className="px-2 py-1">{tc.outputDihasilkan}</td>
                    <td className="px-2 py-1">{tc.waktuEksekusiMs} ms</td>
                    <td className="px-2 py-1">{tc.memoriKb} KB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function
function getBestSubmissions(submissions: any[]) {
  const map = new Map<string, any>()
  submissions.forEach(sub => {
    const key = sub.peserta.id
    if (!map.has(key) ||
      sub.score > map.get(key).score ||
      (sub.score === map.get(key).score && sub.submittedAt < map.get(key).submittedAt)
    ) {
      map.set(key, sub)
    }
  })
  return Array.from(map.values())
}