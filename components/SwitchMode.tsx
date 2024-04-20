'use client';

import { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useTheme } from 'next-themes';

function SwitchMode() {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState<boolean>(
    theme === 'light' ? false : true
  );

  useEffect(() => {
    checked ? setTheme('dark') : setTheme('light');
    // setChecked(true);

    return () => {
      console.log(checked);
    };
  }, [checked]);

  return (
    <>
      <Label htmlFor="airplane-mode">Mode</Label>
      <Switch
        id="airplane-mode"
        checked={checked}
        onCheckedChange={(checked) => {
          setChecked(checked);
        }}
      />
    </>
  );
}

export default SwitchMode;
