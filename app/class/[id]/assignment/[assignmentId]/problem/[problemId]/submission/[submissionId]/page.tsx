'use client';

import { useParams, useRouter } from 'next/navigation';

export default function SubmissionResult() {
  const params = useParams();
  const router = useRouter();

  const submissionData = {
    id: 123,
    status: 'accepted', // accepted, wrong-answer, time-limit-exceeded, compilation-error
    score: 100,
    submittedAt: '2024-07-15T10:30:00Z',
    language: 'cpp',
    executionTime: '45ms',
    memoryUsage: '2.1MB',
    testCases: [
      { id: 1, status: 'passed', time: '12ms', memory: '1.2MB' },
      { id: 2, status: 'passed', time: '15ms', memory: '1.8MB' },
      { id: 3, status: 'passed', time: '18ms', memory: '2.1MB' }
    ],
    code: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    bubbleSort(arr);
    
    for (int i = 0; i < n; i++) {
        cout << arr[i];
        if (i < n-1) cout << " ";
    }
    cout << endl;
    
    return 0;
}`
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'wrong-answer': return 'bg-red-100 text-red-800';
      case 'time-limit-exceeded': return 'bg-yellow-100 text-yellow-800';
      case 'compilation-error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header & Breadcrumb */}
      {/* ... similar to other pages ... */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Submission Result Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Submission #{submissionData.id}</h1>
              <span className={`px-4 py-2 text-lg font-medium rounded-full ${getStatusColor(submissionData.status)}`}>
                {submissionData.status.toUpperCase().replace('-', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>Score: <span className="font-medium text-gray-900">{submissionData.score}/100</span></div>
              <div>Language: <span className="font-medium text-gray-900">{submissionData.language.toUpperCase()}</span></div>
              <div>Time: <span className="font-medium text-gray-900">{submissionData.executionTime}</span></div>
              <div>Memory: <span className="font-medium text-gray-900">{submissionData.memoryUsage}</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Cases Results */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Test Cases</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {submissionData.testCases.map((testCase) => (
                  <div key={testCase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Test Case {testCase.id}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {testCase.time} • {testCase.memory}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submitted Code */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Submitted Code</h2>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{submissionData.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}