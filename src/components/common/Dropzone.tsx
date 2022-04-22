import React, { useCallback } from 'react';
import { SetterOrUpdater } from 'recoil';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Statistics from '@components/statistics/Statistics';
import { Group, Text } from '@mantine/core';
import { Dropzone as DropzoneMT } from '@mantine/dropzone';
import { AllStatistics } from '@components/statistics/types';

type Props = {
  setAllStatistics: SetterOrUpdater<AllStatistics>,
  setStatistics: SetterOrUpdater<Statistics>
}

export default function Dropzone({setStatistics, setAllStatistics}: Props) {
  const {t} = useTranslation();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = (event: ProgressEvent<FileReader>) => {
        let rawStats = {};
        const data = (event.target?.result || '').toString();

        try {
          rawStats = JSON.parse(data);
          const stats = Statistics.build(rawStats);
          setAllStatistics(stats);
          setStatistics(stats.mergedStatistics)
        } catch (error) {
          toast.error(t('errors.cannot_parse_file'));
        }
      };

      reader.onabort = () => toast.error(t('errors.fail_reading_file'));
      reader.onerror = () => toast.error(t('errors.error_while_reading_file'));
    });
  }, [setStatistics, t]);

  return (
    <DropzoneMT
      onDrop={onDrop}
      onReject={(_) => toast.error(t('errors.cannot_parse_file'))}
      multiple={false}
      className="mt-6"
      style={{borderColor: 'var(--primary-color)'}}
    >
      {(_) => (
        <Group position="center" spacing="xl" style={{minHeight: 69, pointerEvents: 'none'}}>
          <Text align="center">
            {t('dropzone.label')}
          </Text>
        </Group>
      )}
    </DropzoneMT>
  );
}