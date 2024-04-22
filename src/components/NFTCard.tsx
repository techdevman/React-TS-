import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

interface NFTCardProps {
  data: {
    name: string;
    mint_number: string;
    image: string;
  };
}

export default function NFTCard(props: NFTCardProps) {
  const { data } = props;

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ display: 'row' }}>
        <CardMedia
          component="img"
          image={data.image}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            {data.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            # {data.mint_number}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}