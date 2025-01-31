import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  IconButton, 
  useTheme,
  Skeleton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  School as StudentIcon, 
  Person as InstructorIcon, 
  Book as BookIcon, 
  AttachMoney as MoneyIcon, 
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import courseApi from "../../services/apiService";

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 85,
    totalRevenue: 45000,
    totalTransactions: 150  // Added static transaction data
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [students, instructors] = await Promise.all([
        courseApi.getStudents(),
        courseApi.getInstructors()
      ]);
      
      setOverviewData(prevState => ({
        ...prevState,
        totalStudents: students.count,
        totalInstructors: instructors.count,
      }));
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, [refreshKey]);

  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 7000, 8000, 6500, 9000],
        fill: false,
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{
      height: '100%',
      transition: 'box-shadow 0.3s',
      '&:hover': { boxShadow: 6 },
      position: 'relative',
      overflow: 'visible'
    }}>
      <CardContent>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography color="textSecondary" variant="h6">
            {title}
          </Typography>
          <IconButton size="small" sx={{ color: `${color}.main` }}>
            {icon}
          </IconButton>
        </Box>
        {loading ? (
          <Skeleton variant="rectangular" width="60%" height={40} />
        ) : (
          <Typography variant="h4" component="div">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
          <IconButton 
            onClick={() => setRefreshKey(prev => prev + 1)} 
            disabled={loading}
            sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Students"
              value={overviewData.totalStudents}
              icon={<StudentIcon />}
              color="primary"
              subtitle="Total Enrolled Students"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              title="Instructors"
              value={overviewData.totalInstructors}
              icon={<InstructorIcon />}
              color="secondary"
              subtitle="Active Instructors"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              title="Transactions"
              value={overviewData.totalTransactions}
              icon={<MoneyIcon />}
              color="success"
              subtitle="Total Completed Transactions"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Registration Trends</Typography>
                  </Box>
                </Box>
                <Box sx={{ height: 400, position: 'relative' }}>
                  {loading ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: '100%'
                    }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Line data={revenueChartData} options={chartOptions} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};

export default AdminDashboard;