import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

const CelestialBodyCard = ({ body }) => {
	const navigate = useNavigate();

	// Log the body object to the console
	useEffect(() => {
		console.log('Celestial Body:', body);
	}, [body]);

	return (
		<Card>
			<CardActionArea onClick={() => navigate(`/cuerpo/${body.id}`)}>
				<CardContent>
					<Typography variant='h6' component='div'>
						{body.name}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{body.bodyType || 'Desconocido'}
					</Typography>
					{body.gravity && <Typography variant='body2'>Gravedad: {body.gravity} m/s²</Typography>}
					{body.density && <Typography variant='body2'>Densidad: {body.density} g/cm³</Typography>}
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default CelestialBodyCard;
