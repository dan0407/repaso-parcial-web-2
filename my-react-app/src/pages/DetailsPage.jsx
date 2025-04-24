import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Grid, CircularProgress,
  Alert, Button, Divider, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [body, setBody] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBodyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.le-systeme-solaire.net/rest.php/bodies/${id}`);
        setBody(response.data);
        setLoading(false);
      } catch (err) {
        setError('No se pudo cargar la información del cuerpo celeste.');
        setLoading(false);
      }
    };

    fetchBodyDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !body) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>
        <Alert severity="error">{error || 'Cuerpo celeste no encontrado'}</Alert>
      </Box>
    );
  }

  // Función para renderizar propiedades del objeto
  const renderProperty = (label, value, unit = '') => {
    if (value === null || value === undefined) return null;

    return (
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" component="span">
          {label}:
        </Typography>{' '}
        <Typography variant="body2" component="span">
          {value} {unit}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {body.name}
        </Typography>

        {body.englishName && body.englishName !== body.name && (
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {body.englishName}
          </Typography>
        )}

        <Chip
          label={body.bodyType || 'Desconocido'}
          color="primary"
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Características Físicas</Typography>
            {renderProperty('Masa', body.mass?.massValue, `× 10^${body.mass?.massExponent} kg`)}
            {renderProperty('Densidad', body.density, 'g/cm³')}
            {renderProperty('Gravedad', body.gravity, 'm/s²')}
            {renderProperty('Radio medio', body.meanRadius, 'km')}
            {renderProperty('Radio ecuatorial', body.equaRadius, 'km')}
            {renderProperty('Radio polar', body.polarRadius, 'km')}
            {renderProperty('Aplanamiento', body.flattening)}
            {renderProperty('Volumen', body.vol?.volValue, `× 10^${body.vol?.volExponent} km³`)}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Características Orbitales</Typography>
            {renderProperty('Semieje mayor', body.semimajorAxis, 'km')}
            {renderProperty('Perihelio', body.perihelion, 'km')}
            {renderProperty('Afelio', body.aphelion, 'km')}
            {renderProperty('Excentricidad', body.eccentricity)}
            {renderProperty('Inclinación', body.inclination, '°')}
            {renderProperty('Período orbital', body.sideralOrbit, 'días')}
            {renderProperty('Período de rotación', body.sideralRotation, 'horas')}
            {renderProperty('Alrededor de', body.aroundPlanet?.planet)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DetailsPage;