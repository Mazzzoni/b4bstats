import { RefObject, useEffect, useState } from 'react';
// @ts-ignore
import { useScreenshot, createFileName } from 'use-react-screenshot';
import { toast } from 'react-toastify';
import { Camera, Loader } from 'react-feather';
import { Menu } from '@mantine/core';

type Props = {
  elementToScreenshotRef: RefObject<HTMLElement>
  filename: string
}

export default function ScreenshotTaker({elementToScreenshotRef, filename}: Props) {
  const [image, takeScreenShot] = useScreenshot();
  const [isLoading, setIsLoading] = useState(false);

  const triggerScreenshotDownload = (image: string) => {
    const a = document.createElement('a');

    a.href = image;
    a.download = createFileName('png', filename);
    a.click();
    a.remove();

    setIsLoading(false);

    toast.success('Screenshot generated ! Check your downloads');
  };

  const getImage = () => {
    setIsLoading(true);
  };

  // We use a second useEffect to trigger the screenshot process, if not then the isLoading props isn't set in time
  useEffect(() => {
    if (isLoading) {
      takeScreenShot(elementToScreenshotRef.current);
    }
  }, [isLoading]);

  useEffect(() => {
    if (image) {
      triggerScreenshotDownload(image);
    }
  }, [image]);

  return (
    <Menu>
      <Menu.Item
        icon={isLoading ? <Loader size={16} className="animate-spin"/> : <Camera size={16}/>}
        onClick={getImage}
      >
        {isLoading ? 'Generating screenshot...' : 'Take screenshot'}
      </Menu.Item>
    </Menu>
  );
}