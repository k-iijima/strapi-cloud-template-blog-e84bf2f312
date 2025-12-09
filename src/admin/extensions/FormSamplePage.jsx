import React, { useState } from 'react';
import { Page, Layouts } from '@strapi/strapi/admin';
import { useFetchClient } from '@strapi/strapi/admin';
import {
  Box,
  Button,
  TextInput,
  Textarea,
  Typography,
  Grid,
  Alert,
  Field,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';

const FormSamplePage = () => {
  const { post } = useFetchClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    } else if (formData.title.length < 3) {
      newErrors.title = 'タイトルは3文字以上である必要があります';
    }

    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    }

    if (!formData.category) {
      newErrors.category = 'カテゴリーを選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmittedData(null);

    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'フォームに入力エラーがあります' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Articleとして保存
      const response = await post('/content-manager/collection-types/api::article.article', {
        title: formData.title,
        description: formData.description,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
      });

      console.log('保存されたArticle:', response.data);

      // 送信されたデータを保存
      const submittedInfo = {
        ...formData,
        submittedAt: new Date().toLocaleString('ja-JP'),
        id: response.data.data.id,
      };
      
      setSubmittedData(submittedInfo);
      setSubmitStatus({ type: 'success', message: `記事が正常に保存されました！(ID: ${response.data.data.id})` });
      
      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        category: '',
        status: 'draft',
      });
    } catch (error) {
      console.error('送信エラー:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: `保存に失敗しました: ${error.response?.data?.error?.message || error.message || '不明なエラー'}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'draft',
    });
    setErrors({});
    setSubmitStatus(null);
    setSubmittedData(null);
  };

  return (
    <Page.Main>
      <Layouts.Header
        title="フォームサンプル"
        subtitle="独自のフォーム入力とバリデーションの例"
      />
      <Layouts.Content>
        <Box padding={8}>
          <Box
            background="neutral0"
            padding={6}
            hasRadius
            shadow="tableShadow"
            style={{ position: 'relative', overflow: 'visible' }}
          >
            <form onSubmit={handleSubmit}>
              <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* アラート表示 */}
                {submitStatus && (
                  <Alert
                    variant={submitStatus.type === 'success' ? 'success' : 'danger'}
                    title={submitStatus.message}
                    onClose={() => setSubmitStatus(null)}
                    closeLabel="閉じる"
                  />
                )}

                {/* タイトル */}
                <TextInput
                  label="タイトル"
                  name="title"
                  placeholder="タイトルを入力してください"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={errors.title}
                  required
                />

                {/* 説明 */}
                <Textarea
                  label="説明"
                  name="description"
                  placeholder="詳細な説明を入力してください"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  error={errors.description}
                  required
                >
                  {formData.description}
                </Textarea>

                {/* カテゴリーとステータス */}
                <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* カテゴリー */}
                  <Field.Root error={errors.category} required>
                    <Field.Label>カテゴリー</Field.Label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: errors.category ? '1px solid #d02b20' : '1px solid #dcdce4',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">カテゴリーを選択</option>
                      <option value="technology">テクノロジー</option>
                      <option value="business">ビジネス</option>
                      <option value="design">デザイン</option>
                      <option value="marketing">マーケティング</option>
                    </select>
                    {errors.category && <Field.Error>{errors.category}</Field.Error>}
                  </Field.Root>

                  {/* ステータス */}
                  <Field.Root>
                    <Field.Label>ステータス</Field.Label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #dcdce4',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="draft">下書き</option>
                      <option value="published">公開</option>
                      <option value="archived">アーカイブ</option>
                    </select>
                  </Field.Root>
                </Box>

                {/* 送信データプレビュー */}
                <Box padding={4} background="neutral100" hasRadius>
                  <Typography variant="sigma" textColor="neutral600" style={{ marginBottom: '0.5rem' }}>
                    フォームデータプレビュー:
                  </Typography>
                  <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </Box>

                {/* 送信結果表示 */}
                {submittedData && (
                  <Box padding={4} background="success100" hasRadius borderColor="success600">
                    <Typography variant="sigma" textColor="success700" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      ✓ 送信完了データ:
                    </Typography>
                    <pre style={{ fontSize: '0.875rem', overflow: 'auto', color: '#2f6846' }}>
                      {JSON.stringify(submittedData, null, 2)}
                    </pre>
                  </Box>
                )}

                {/* ボタン */}
                <Box style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <Button variant="tertiary" onClick={handleReset} type="button" disabled={isSubmitting}>
                    リセット
                  </Button>
                  <Button type="submit" startIcon={<Check />} loading={isSubmitting}>
                    {isSubmitting ? '送信中...' : '送信'}
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Layouts.Content>
    </Page.Main>
  );
};

export default FormSamplePage;
