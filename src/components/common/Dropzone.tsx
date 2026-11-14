import React, { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Statistics from '@components/statistics/Statistics';
import SavetoLocalState from '@components/self/SaveToLocalState';
import { Group, Text } from '@mantine/core';
import { Dropzone as DropzoneMT } from '@mantine/dropzone';
import { trackEvent } from '@utils/analytics';
type Props = {
  setStatistics: (stats: Statistics) => void;
  persist?: boolean;
};
export default function Dropzone({ setStatistics, persist = true }: Props) {
  const saveToLocal = useAtomValue(SavetoLocalState);
  const { t } = useTranslation();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event: ProgressEvent<FileReader>) => {
          let rawStats = {};
          const data = (event.target?.result || '').toString();
          try {
            rawStats = JSON.parse(data);
            const stats = Statistics.build(rawStats);
            setStatistics(stats);
            if (persist && saveToLocal) {
              localStorage.setItem('statsFile', data);
            }
            trackEvent('Statistics analyzed');
          } catch (error) {
            toast.error(t('errors.cannot_parse_file'));
          }
        };
        reader.onabort = () => toast.error(t('errors.fail_reading_file'));
        reader.onerror = () => toast.error(t('errors.error_while_reading_file'));
      });
    },
    [setStatistics, t, saveToLocal, persist],
  );
  return (
    <DropzoneMT
      onDrop={onDrop}
      onReject={(_) => toast.error(t('errors.cannot_parse_file'))}
      multiple={false}
      className="mt-6"
      style={{ borderColor: 'var(--primary-color)' }}
    >
      {
        <Group justify="center" gap="xl" style={{ minHeight: 69, pointerEvents: 'none' }}>
          <Text ta="center">{t('dropzone.label')}</Text>
        </Group>
      }
    </DropzoneMT>
  );
}
