import CustomIcon from './extensions/CustomIcon';
import { ChartCircle } from '@strapi/icons';

const config = {};

const register = (app) => {
  // Strapi 5.13以上でのみ動作するため、APIの存在を確認
  if ('widgets' in app && typeof app.widgets?.register === 'function') {
    // ホームページウィジェットを登録
    app.widgets.register({
      id: 'chart-widget',
      icon: ChartCircle,
      title: {
        id: 'chart-widget.title',
        defaultMessage: 'Monthly Article Trends',
      },
      component: async () => {
        const { default: component } = await import('./extensions/components/ChartWidget');
        return component;
      },
    });
  }
};

const bootstrap = (app) => {
  // カスタムページへのメニューリンクを追加
  app.addMenuLink({
    to: '/custom-page',
    icon: CustomIcon,
    intlLabel: {
      id: 'custom-page.title',
      defaultMessage: 'Custom Page',
    },
    Component: async () => {
      const component = await import(
        /* webpackChunkName: "custom-page" */ './extensions/CustomPage'
      );
      return component;
    },
    permissions: [],
  });

  // フォームサンプルページを追加
  app.addMenuLink({
    to: '/form-sample',
    icon: CustomIcon,
    intlLabel: {
      id: 'form-sample.title',
      defaultMessage: 'Form Sample',
    },
    Component: async () => {
      const component = await import(
        /* webpackChunkName: "form-sample" */ './extensions/FormSamplePage'
      );
      return component;
    },
    permissions: [],
  });
};

export default {
  config,
  register,
  bootstrap,
};
