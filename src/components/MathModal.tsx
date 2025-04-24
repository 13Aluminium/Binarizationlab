import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface MathModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formula: string;
  explanation: string;
  pseudoCode: string;
}

const MathModal: React.FC<MathModalProps> = ({
  isOpen,
  onClose,
  title,
  formula,
  explanation,
  pseudoCode,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 dark:bg-opacity-70"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 w-full max-w-2xl mx-4 rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-700">
          <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <h4 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-3">Mathematical Formula</h4>
            <div className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-inner overflow-x-auto">
              <div className="dark:text-white">
                <BlockMath>{formula}</BlockMath>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-3">Explanation</h4>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{explanation}</p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-3">Pseudo Code</h4>
            <pre className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-inner overflow-x-auto font-mono text-sm text-stone-700 dark:text-stone-300">
              {pseudoCode}
            </pre>
          </div>
        </div>
        
        <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-b-lg border-t border-stone-200 dark:border-stone-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-stone-700 dark:bg-stone-600 text-white rounded-md hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MathModal;