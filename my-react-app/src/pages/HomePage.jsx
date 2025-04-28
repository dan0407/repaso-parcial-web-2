import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Grid,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	CircularProgress,
	Alert,
	Typography,
} from '@mui/material';
import axios from 'axios';
import CelestialBodyCard from '../components/CelestialBodyCard';

const HomePage = () => {
	const [bodies, setBodies] = useState([]);
	const [filteredBodies, setFilteredBodies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState('name');
	const [searchTerm, setSearchTerm] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		const fetchBodies = async () => {
			try {
				const response = await axios.get('https://api.le-systeme-solaire.net/rest.php/bodies?rowData=false');
				console.log('Respuesta completa:', response.data); // Inspecciona aquí
				setBodies(response.data.bodies);
				setFilteredBodies(response.data.bodies);
				setLoading(false);
			} catch (err) {
				console.error('Error al cargar los datos:', err);
				setError('Error al cargar los datos. Intente nuevamente.');
				setLoading(false);
			}
		};

		fetchBodies();
	}, []);

	useEffect(() => {
		// Filtrar y ordenar cuerpos celestes
		let result = [...bodies];

		// Filtrar por término de búsqueda
		if (searchTerm) {
			result = result.filter((body) => body.name.toLowerCase().includes(searchTerm.toLowerCase()));
		}

		// Ordenar cuerpos
		result.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name);
				case 'mass':
					const massA = a.mass ? a.mass.massValue : 0;
					const massB = b.mass ? b.mass.massValue : 0;
					return massB - massA;
				case 'density':
					return (b.density || 0) - (a.density || 0);
				case 'gravity':
					return (b.gravity || 0) - (a.gravity || 0);
				case 'diameter':
					return (b.meanRadius || 0) - (a.meanRadius || 0);
				default:
					return 0;
			}
		});

		setFilteredBodies(result);
	}, [bodies, sortBy, searchTerm]);

	const handleRandomExplore = () => {
		const randomIndex = Math.floor(Math.random() * bodies.length);
		const randomBody = bodies[randomIndex];
		navigate(`/cuerpo/${randomBody.id}`);
	};

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity='error'>{error}</Alert>;
	}

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant='h4' component='h1'>
					Cuerpos Celestes
				</Typography>
				<Button variant='contained' color='primary' onClick={handleRandomExplore}>
					Explorar Aleatorio
				</Button>
			</Box>

			<Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
				<TextField
					label='Buscar'
					variant='outlined'
					size='small'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					sx={{ flexGrow: 1 }}
				/>

				<FormControl size='small' sx={{ minWidth: 150 }}>
					<InputLabel>Ordenar Por</InputLabel>
					<Select value={sortBy} label='Ordenar Por' onChange={(e) => setSortBy(e.target.value)}>
						<MenuItem value='name'>Nombre</MenuItem>
						<MenuItem value='mass'>Masa</MenuItem>
						<MenuItem value='density'>Densidad</MenuItem>
						<MenuItem value='gravity'>Gravedad</MenuItem>
						<MenuItem value='diameter'>Diámetro</MenuItem>
					</Select>
				</FormControl>
			</Box>

			<Grid container spacing={3}>
				{filteredBodies.map((body) => (
					<Grid item xs={12} sm={6} md={4} key={body.id}>
						<CelestialBodyCard body={body} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default HomePage;
