import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Paper,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface WeightEntry {
  date: string;
  weight: number;
}

function App() {
  const theme = useTheme();
  const [weight, setWeight] = useState<string>('');
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const savedEntries = localStorage.getItem('weightEntries');
    if (savedEntries) {
      setWeightEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleSubmit = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setMessage({ text: 'Please enter a valid weight number', type: 'error' });
      return;
    }

    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: weightNum,
    };

    const updatedEntries = [...weightEntries, newEntry].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setWeightEntries(updatedEntries);
    localStorage.setItem('weightEntries', JSON.stringify(updatedEntries));
    setWeight('');
    setMessage({ text: 'Weight logged successfully!', type: 'success' });

    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = (date: string) => {
    const updatedEntries = weightEntries.filter(entry => entry.date !== date);
    setWeightEntries(updatedEntries);
    localStorage.setItem('weightEntries', JSON.stringify(updatedEntries));
    setMessage({ text: 'Entry deleted successfully!', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const chartData = {
    labels: [...weightEntries].reverse().map(entry => entry.date),
    datasets: [
      {
        label: 'Weight Progress',
        data: [...weightEntries].reverse().map(entry => entry.weight),
        fill: true,
        backgroundColor: 'rgba(0, 188, 212, 0.1)',
        borderColor: '#00bcd4',
        tension: 0.4,
        pointBackgroundColor: '#00bcd4',
        pointBorderColor: '#132f4c',
        pointHoverBackgroundColor: '#132f4c',
        pointHoverBorderColor: '#00bcd4',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: theme.typography.fontFamily,
          },
          color: theme.palette.text.primary,
        },
      },
      title: {
        display: true,
        text: 'Weight Progress Over Time',
        color: theme.palette.text.primary,
        font: {
          size: 20,
          family: theme.typography.fontFamily,
          weight: 600,
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0a1929 0%, #132f4c 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #00bcd4 30%, #80deea 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
              textShadow: '0 0 20px rgba(0,188,212,0.3)',
            }}
          >
            Weight Tracker
          </Typography>
          
          {message && (
            <Alert 
              severity={message.type} 
              sx={{ 
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {message.text}
            </Alert>
          )}

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              background: 'rgba(19, 47, 76, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <Stack spacing={3}>
              <Typography 
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.light,
                  textShadow: '0 0 10px rgba(0,188,212,0.3)',
                }}
              >
                Log Today's Weight
              </Typography>
              <TextField
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
                fullWidth
                variant="outlined"
                label="Weight"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                size="large"
                fullWidth
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #00bcd4 30%, #80deea 90%)',
                  boxShadow: '0 3px 15px rgba(0,188,212,0.4)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,188,212,0.6)',
                  },
                }}
              >
                Log Weight
              </Button>
            </Stack>
          </Paper>

          {weightEntries.length > 0 && (
            <Stack spacing={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4,
                  background: 'rgba(19, 47, 76, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Line data={chartData} options={chartOptions} />
                </Box>
              </Paper>
              <Paper 
                elevation={3} 
                sx={{ 
                  background: 'rgba(19, 47, 76, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Weight</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weightEntries.map((entry) => (
                        <TableRow key={entry.date}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell align="right">{entry.weight}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete entry">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDelete(entry.date)}
                                sx={{ 
                                  color: theme.palette.error.main,
                                  '&:hover': {
                                    color: theme.palette.error.light,
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Stack>
          )}

          {weightEntries.length === 0 && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                background: 'rgba(19, 47, 76, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              <Typography 
                align="center" 
                color="text.secondary"
                sx={{ 
                  py: 8,
                  px: 2,
                  fontSize: '1.1rem',
                  fontStyle: 'italic'
                }}
              >
                No weight entries yet. Start logging your weight to see your progress!
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
