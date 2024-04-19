import React from 'react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any; // Typisieren Sie dies entsprechend Ihren Daten
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, document }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{document.originalName}</h2>
        {/* Weitere Details des Dokuments anzeigen */}
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default DocumentModal;