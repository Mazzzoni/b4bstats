import { createContext, useContext, useState, type RefObject } from 'react';
import { Button } from '@mantine/core';
import { Camera } from 'react-feather';
export const AnalyzerExportContext = createContext(true);
export default function ScreenshotTaker({
  elementToScreenshotRef,
  filename,
}: {
  elementToScreenshotRef: RefObject<HTMLElement | null>;
  filename: string;
}) {
  const allowed = useContext(AnalyzerExportContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!allowed) return null;
  async function save() {
    if (!elementToScreenshotRef.current) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(elementToScreenshotRef.current);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = filename + '.png';
      a.click();
    } catch {
      setError('Could not create image.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <Button
        variant="subtle"
        color="gray"
        size="xs"
        loading={busy}
        onClick={save}
        leftSection={<Camera size={14} />}
      >
        Take screenshot
      </Button>
      {error && (
        <p role="alert" className="text-xs text-brand">
          {error}
        </p>
      )}
    </div>
  );
}
