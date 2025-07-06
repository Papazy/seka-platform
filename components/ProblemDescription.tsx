'use client';

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface ProblemDescriptionProps {
  problemData: {
    description: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    examples: Example[];
  };
}

export default function ProblemDescription({ problemData }: ProblemDescriptionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Description</h3>
        <div className="prose max-w-none">
          <div className="whitespace-pre-line text-gray-700">
            {problemData.description}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Input Format</h4>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{problemData.inputFormat}</pre>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Output Format</h4>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{problemData.outputFormat}</pre>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Constraints</h4>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{problemData.constraints}</pre>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Examples</h4>
        <div className="space-y-4">
          {problemData.examples.map((example, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h5 className="font-medium text-gray-900">Example {index + 1}</h5>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Input:</h6>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                      <pre>{example.input}</pre>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Output:</h6>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                      <pre>{example.output}</pre>
                    </div>
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Explanation:</h6>
                  <p className="text-gray-600 text-sm">{example.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}