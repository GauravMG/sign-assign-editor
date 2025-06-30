// Suppress harmless ResizeObserver errors
const rawError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("ResizeObserver loop")
  ) {
    return;
  }
  rawError(...args);
};

import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import koKR from 'antd/es/locale/ko_KR';
import i18next from 'i18next';
import App from './App';
import { i18nClient } from './i18n';
import { register } from './serviceWorker';

const antResources = {
	ko: koKR,
	'ko-KR': koKR,
	en: enUS,
	'en-US': enUS,
};

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const rootElement = document.getElementById('root');

const render = (Component: React.ElementType) => {
	ReactDom.render(
		<ConfigProvider locale={antResources[i18next.language]}>
			<BrowserRouter>
				<Component />
			</BrowserRouter>
		</ConfigProvider>,
		rootElement,
	);
};

i18nClient();

render(App);

register();
