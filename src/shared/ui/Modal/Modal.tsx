import type { CSSProperties, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  maxWidth?: string;
  bodyStyle?: CSSProperties;
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '400px', bodyStyle = {} }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth, display: 'flex', flexDirection: 'column' }}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body" style={{ flex: 1, ...bodyStyle }}>
          {children}
        </div>
      </div>
    </div>
  );
};
