import React from 'react';
import { Page, Layouts } from '@strapi/strapi/admin';
import { Box } from '@strapi/design-system';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Chart.jsのコンポーネントを登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  // チャートデータ
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Articles Published',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Article Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Page.Main>
      <Layouts.Header
        title="Dashboard"
        subtitle="Monthly Article Trends"
      />
      <Layouts.Content>
        <Box padding={8}>
          <Box
            background="neutral0"
            padding={6}
            hasRadius
            shadow="tableShadow"
          >
            <div style={{ height: '400px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Box>
        </Box>
      </Layouts.Content>
    </Page.Main>
  );
};

export default DashboardPage;
