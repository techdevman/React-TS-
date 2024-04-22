import React, { useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import NFTCard from '../components/NFTCard';

interface NFTType {
  name: string;
  mint_number: string;
  image: string;
}
interface collectionType {
  collection: {
    contract: string,
    collection_name: string,
    name: string,
    author: string,
    allow_notify: true,
    authorized_accounts: [
      string
    ],
    notify_accounts: [
      string
    ],
    market_fee: 0,
    data: {},
    img: string,
    created_at_block: string,
    created_at_time: string
  },
  assets: string
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Home() {
  const [nfts, setNfts] = useState<NFTType[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const account = data.get('account');

    try {
      fetch(`https://eos.api.atomicassets.io/atomicassets/v1/accounts/${account}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          response.json().then((jsonRes) => {
            if (jsonRes.success === true) {
              // console.log(jsonRes)
              const collections = jsonRes.data.collections;
              collections.map((collection: collectionType) => {
                fetch(`https://eos.api.atomicassets.io/atomicassets/v1/accounts/${account}/${collection.collection.collection_name}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }).then((res) => {
                  res.json().then((jsonResponse) => {
                    if (jsonResponse.success === true) {
                      const payload = {
                        name: collection.collection.name,
                        mint_number: jsonResponse.data.templates[0].template_id,
                        image: "https://ipfs.io/ipfs/" + collection.collection.img
                      }
                      setNfts([...nfts, payload]);
                    } else {
                      console.log(jsonResponse);
                    }
                  })
                })
              })
            } else {
              console.log(jsonRes);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="NFTs" />
        <main>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField 
              id="account" 
              name="account"
              label="Account" 
              variant="filled" 
              required
              autoFocus
            />
            <IconButton type="submit" color="primary" aria-label="send">
              <SendIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Divider />
          <Grid container spacing={4}>
            {nfts.map((nft) => (
              <NFTCard data={nft} />
            ))}
          </Grid>
        </main>
      </Container>
      <Footer
        description=""
      />
    </ThemeProvider>
  );
}