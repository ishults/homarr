import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider, MantineTheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useHotkeys } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { ConfigProvider } from '../tools/state';
import { theme } from '../tools/theme';
import { ColorTheme } from '../tools/color';

export default function App(this: any, props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const [primaryColor, setPrimaryColor] = useState<MantineTheme['primaryColor']>('red');
  const [secondaryColor, setSecondaryColor] = useState<MantineTheme['primaryColor']>('orange');
  const [primaryShade, setPrimaryShade] = useState<MantineTheme['primaryShade']>(6);
  const colorTheme = {
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
    primaryShade,
    setPrimaryShade,
  };

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <ColorTheme.Provider value={colorTheme}>
          <MantineProvider
            theme={{
              ...theme,
              components: {
                Checkbox: {
                  styles: {
                    input: { cursor: 'pointer' },
                    label: { cursor: 'pointer' },
                  },
                },
                Switch: {
                  styles: {
                    input: { cursor: 'pointer' },
                    label: { cursor: 'pointer' },
                  },
                },
              },
              primaryColor,
              primaryShade,
              colorScheme,
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <NotificationsProvider limit={4} position="bottom-left">
              <ModalsProvider>
                <ConfigProvider>
                  <Component {...pageProps} />
                </ConfigProvider>
              </ModalsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorTheme.Provider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('color-scheme', ctx) || 'light',
});
