import { useCallback, useState } from 'react';
import { set, unset, useClient } from 'sanity';
import type { ObjectInputProps } from 'sanity';

/**
 * Custom Sanity input for video uploads.
 * - "Record Video" button: opens camera directly on mobile (capture="environment")
 * - "Choose File" button: standard file picker (desktop/gallery)
 * - Shows video preview after upload
 * - Falls back to Sanity&apos;s default file handling for state management
 */
export default function VideoInput(props: ObjectInputProps) {
  const { onChange, value } = props;
  const client = useClient({ apiVersion: '2024-01-13' });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existingAsset = (value as Record<string, unknown>)?.asset as
    | { _ref?: string }
    | undefined;

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file.');
        return;
      }

      setError(null);
      setUploading(true);
      setPreviewUrl(URL.createObjectURL(file));

      try {
        const asset = await client.assets.upload('file', file, {
          contentType: file.type,
          filename: file.name,
        });

        onChange(
          set({
            _type: 'file',
            asset: { _type: 'reference', _ref: asset._id },
          })
        );
      } catch (err) {
        setError('Upload failed. Please try again.');
        setPreviewUrl(null);
        console.error('Video upload error:', err);
      } finally {
        setUploading(false);
      }
    },
    [client, onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(unset());
    setPreviewUrl(null);
    setError(null);
  }, [onChange]);

  const hasVideo = !!existingAsset?._ref || !!previewUrl;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Video preview */}
      {previewUrl && (
        <video
          src={previewUrl}
          controls
          playsInline
          muted
          style={{
            width: '100%',
            maxHeight: '300px',
            borderRadius: '4px',
            background: '#000',
          }}
        />
      )}

      {hasVideo && !previewUrl && (
        <div
          style={{
            padding: '12px 16px',
            background: '#f0faf0',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#2d6a2d',
            border: '1px solid #c6e6c6',
          }}
        >
          Video uploaded successfully
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{ fontSize: '13px', color: '#e53e3e' }}>{error}</div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {/* Camera capture — mobile-first */}
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: uploading ? '#ccc' : '#F27149',
            color: '#fff',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          {uploading ? 'Uploading\u2026' : 'Record Video'}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            capture="environment"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>

        {/* Standard file picker */}
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: uploading ? '#ccc' : '#e5e5e5',
            color: '#333',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Choose File
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>

        {/* Remove */}
        {hasVideo && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#e53e3e',
              border: '1px solid #e53e3e',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Remove
          </button>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
        MP4, WebM, or MOV. &quot;Record Video&quot; opens your camera on mobile.
      </p>
    </div>
  );
}
