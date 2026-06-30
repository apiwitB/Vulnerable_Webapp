import { useState } from 'react';

export default function FileUploader({ onUploadComplete, onError }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      // Import dynamically to avoid circular references
      const { uploadAvatar } = await import('../api/upload');
      const response = await uploadAvatar(selectedFile);
      if (onUploadComplete) {
        onUploadComplete(response.avatar_url);
      }
      setSelectedFile(null);
    } catch (err) {
      if (onError) {
        onError(err.message || 'File upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label className="products-count" style={{ display: 'block', marginBottom: '4px' }}>
        Upload New Avatar
      </label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* [VULN] Insecure File Upload: accept="*" does not filter files on client side */}
        <input
          type="file"
          id="avatar-file-input"
          accept="*"
          onChange={handleFileChange}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '13px',
            flex: 1
          }}
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
          id="btn-upload-file"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {selectedFile && (
        <span style={{ fontSize: '12px', color: 'var(--accent-light)' }}>
          Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
        </span>
      )}
    </div>
  );
}
