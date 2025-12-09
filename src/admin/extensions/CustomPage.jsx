import React from 'react';
import { Page, Layouts } from '@strapi/strapi/admin';

const CustomPage = () => {
  return (
    <Page.Main>
      <Layouts.Header
        title="カスタムページ"
        subtitle="これはカスタムページの例です"
      />
      <Layouts.Content>
        <div style={{ padding: '24px' }}>
          <h2>ようこそカスタムページへ</h2>
          <p>このページは管理画面に追加されたカスタムページです。</p>
          <p>ここに独自の機能やコンテンツを追加できます。</p>
        </div>
      </Layouts.Content>
    </Page.Main>
  );
};

export default CustomPage;
