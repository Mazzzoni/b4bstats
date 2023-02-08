import { useRecoilState, useSetRecoilState } from 'recoil';
import { Trans, useTranslation } from 'react-i18next';
import StatisticsState from '@components/self/StatisticsState';
import SavetoLocalState from '@components/self/SaveToLocalState';
import { Divider, Kbd, Checkbox, Tooltip } from '@mantine/core';
import Dropzone from '@components/common/Dropzone';
import { HelpCircle } from 'react-feather';

export default function Introduction() {
  const [saveToLocal, setSaveToLocal] = useRecoilState(SavetoLocalState);
  const setStatistics = useSetRecoilState(StatisticsState);
  const {t} = useTranslation();

  return (
    <div>
      <p>{t('introduction.first_introduction')}</p>

      <div className="my-6">
        <div className="flex">
          <img src="/images/steam.svg" alt="Steam" className="h-8 w-8"/>
          <h3 className="text-3xl ml-2">{t('introduction.steam')}</h3>
        </div>

        {t('introduction.steam_instructions')}
        <br/>
        <Kbd className="color-primary color-bg-secondary"><b>{'<disk>:\\Users\\<username>\\AppData\\Local\\Back4Blood\\Steam\\Saved\\SaveGames\\PlayerProfileSettings.json'}</b></Kbd>
      </div>

      <Divider variant="dashed"/>

      <div className="my-6">
        <div className="flex">
          <img src="/images/xbox.svg" alt="Xbox Game Pass" className="h-8 w-8"/>
          <h3 className="text-3xl ml-2">{t('introduction.xbox_game_pass')}</h3>
        </div>

        <Trans
          i18nKey="introduction.xbox_game_pass_instructions"
          components={{b: <b className="text-decoration-underline"/>}}
        />
        <br/>
        <Kbd className="color-primary color-bg-secondary"><b>{'<disk>:\\Users\\<username>\\AppData\\Local\\Packages\\WarnerBros.Interactive.<some key>\\SystemAppData\\wgs\\'}</b></Kbd>
        <br/>
        <Trans
          i18nKey="introduction.xbox_game_pass_instructions_2"
          components={{b: <b/>}}
        />
      </div>

      <Divider variant="dashed"/>

      <div className="my-6">
        <div className="flex">
          <img src="/images/epic_games.svg" alt="Epic Games" className="h-8 w-8"/>
          <h3 className="text-3xl ml-2">{t('introduction.epic_games_store')}</h3>
        </div>

        {t('introduction.epic_games_store_instructions')}
        <br/>
        <Kbd className="color-primary color-bg-secondary"><b>{'<disk>:\\Users\\<username>\\AppData\\Local\\Back4Blood\\Epic\\Saved\\SaveGames\\PlayerProfileSettings.json'}</b></Kbd>
      </div>

      <Divider variant="dashed"/>

      <div className="text-sm mt-6">
        <p>
          <Trans
            i18nKey="introduction.windows_disclaimer"
            components={{b: <b/>, code: <code className="color-primary"/>}}
          />
        </p>
      </div>

      <Dropzone setStatistics={setStatistics}/>

      <Tooltip label="Put statistics file into your browser cache, you can clear it at any moment">
        <Checkbox
          className="mt-2 select-none cursor-pointer hover:bg-white/10"
          label={(
            <span className="flex">
              {t('introduction.save_to_local')}
              <HelpCircle size={16} className="relative top-[2px] ml-1"/>
            </span>
          )}
          checked={saveToLocal}
          onChange={(e) => setSaveToLocal(e.target.checked)}
        />
      </Tooltip>
    </div>
  );
}