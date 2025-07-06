// app/components/CodeEditor.tsx
'use client';

import { useRef, useState } from 'react';
import AceEditor from "react-ace"

// Import themes
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';

// Import language modes
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-javascript';

// Import extensions
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

interface Language {
  value: string;
  label: string;
  aceMode: string;
}

interface TestCase {
  input: string;
  expected_output: string;
}

interface JudgeResult {
  input: string;
  expected_output: string;
  actual_output: string;
  passed: boolean;
  status: string;
  execution_time: number;
}

interface JudgeResponse {
  status: string;
  total_case: number;
  total_case_benar: number;
  results: JudgeResult[];
  error_message: string | null;
}

// ✅ Update interface to match new async system
interface CodeEditorProps {
  code: string;
  language: string;
  languages: Language[];
  isSubmitting: boolean;
  maxScore: number;
  testCases: TestCase[];
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onSubmit: () => void; // ✅ Remove JudgeResponse parameter
  submitButtonText?: string; // ✅ Add optional prop
}

export default function CodeEditor({
  code,
  language,
  languages,
  isSubmitting,
  maxScore,
  testCases,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  submitButtonText = 'Submit Solution',
}: CodeEditorProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<JudgeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<AceEditor>(null);
  const [theme, setTheme] = useState('monokai');
  const [fontSize, setFontSize] = useState(14);

  const getLanguageForAPI = (lang: string) => {
    const langMap: { [key: string]: string } = {
      'c': 'c',
      'cpp': 'cpp',
      'java': 'java',
      'python': 'python',
    };
    return langMap[lang] || 'python';
  };

  const getAceMode = (lang: string) => {
    const currentLang = languages.find(l => l.value === lang);
    return currentLang?.aceMode || 'python';
  };

  // ✅ Only for testing (not submission)
  const handleTest = async () => {
    if (!code.trim()) {
      setError('Please write some code first');
      return;
    }

    setIsTesting(true);
    setError(null);
    setTestResults(null);

    try {
      const payload = {
        code: code,
        language: getLanguageForAPI(language),
        test_cases: testCases
      };

      const response = await fetch(`http://localhost:8000/judge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: JudgeResponse = await response.json();
      setTestResults(result);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to test code';
      setError(errorMessage);
      console.error('Judge API error:', err);
    } finally {
      setIsTesting(false);
    }
  };

  // ✅ Simple submit handler - no judging here
  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Please write some code first');
      return;
    }
    
    setError(null);
    onSubmit(); // Call parent handler
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'text-green-600';
      case 'wrong_answer': return 'text-red-600';
      case 'time_limit_exceeded': return 'text-yellow-600';
      case 'runtime_error': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const insertTemplate = () => {
    const template = getTemplate(language);
    onCodeChange(template);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg sticky top-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Submit Solution</h2>

        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Programming Language
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full text-gray-600 placeholder-gray-600 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] text-sm"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Template Button */}
        {/* <div className="mb-4">
          <button
            onClick={insertTemplate}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors"
          >
            Insert Template
          </button>
        </div> */}

        {/* Code Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Code
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <AceEditor
              ref={editorRef}
              mode={getAceMode(language)}
              theme={theme}
              value={code}
              onChange={onCodeChange}
              name="code-editor"
              width="100%"
              height="400px"
              fontSize={fontSize}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 4,
                useWorker: false,
              }}
              editorProps={{
                $blockScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Test Results: {testResults.total_case_benar}/{testResults.total_case} passed
            </h3>
            
            {/* Overall Status */}
            <div className={`mb-3 p-2 rounded-lg text-sm font-medium ${
              testResults.status === 'finished' && testResults.total_case_benar === testResults.total_case
                ? 'bg-green-50 text-green-700 border border-green-200'
                : testResults.status === 'compile_error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              {testResults.status === 'compile_error' ? (
                <div>
                  <div className="font-semibold">❌ Compilation Error</div>
                  <div className="mt-1 text-xs font-mono whitespace-pre-wrap">
                    {testResults.error_message || 'Code failed to compile'}
                  </div>
                </div>
              ) : testResults.total_case_benar === testResults.total_case ? (
                '✅ All test cases passed!'
              ) : (
                `⚠️ ${testResults.total_case_benar}/${testResults.total_case} test cases passed`
              )}
            </div>

            {/* Test Case Details */}
            {testResults.results && testResults.results.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {testResults.results.map((result, index) => (
                  <div key={index} className="text-xs border border-gray-200 rounded p-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Test Case {index + 1}</span>
                      <span className={`font-medium ${getStatusColor(result.status)}`}>
                        {result.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </div>
                    <div className="text-gray-600 space-y-1">
                      <div><span className="font-medium">Input:</span> {result.input}</div>
                      <div><span className="font-medium">Expected:</span> {result.expected_output}</div>
                      <div><span className="font-medium">Got:</span> {result.actual_output}</div>
                      <div><span className="font-medium">Time:</span> {result.execution_time.toFixed(3)}s</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !code.trim()}
            className="w-full bg-[#3ECF8E] hover:bg-[#2DD4BF] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {submitButtonText}
              </div>
            ) : (
              submitButtonText
            )}
          </button>

          {/* Test Button */}
          <button
            onClick={handleTest}
            disabled={isTesting || !code.trim() || isSubmitting}
            className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {isTesting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </div>
            ) : (
              'Test with Sample'
            )}
          </button>
        </div>

        {/* Problem Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Problem Info</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Max Score:</span>
              <span className="font-medium">{maxScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Sample Test Cases:</span>
              <span className="font-medium">{testCases.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Limit:</span>
              <span className="font-medium">1000ms</span>
            </div>
            <div className="flex justify-between">
              <span>Memory Limit:</span>
              <span className="font-medium">256MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTemplate(language: string): string {
  switch (language) {
    case 'cpp':
      return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`;
    case 'java':
      return `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Your code here
        
        scanner.close();
    }
}`;
    case 'python':
      return `#!/usr/bin/env python3

def solve():
    # Your code here
    pass

if __name__ == "__main__":
    solve()`;
    case 'c':
      return `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Your code here
    
    return 0;
}`;
    case 'javascript':
      return `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    // Your code here
    
    rl.close();
});`;
    default:
      return '// Write your code here...';
  }
}