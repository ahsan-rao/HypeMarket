import React, { Component, useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';


import CartModal from './CartModal.jsx';

import styles from '../stylesheets/navBar.scss';

const pages = ['Cart', 'Signout'];

const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '30%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function NavBar() {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    console.log('handleOpen clicked')
    setOpen(true);
  }
  const handleClose = () => {
    console.log('handleClose clicked')
    setOpen(false);
  }

  const handleSignOut = () => {
    console.log('handlesignout clicked')
    document.cookie = "SSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = 'http://localhost:8080';
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <nav className='navbar'>
      <div className="logo">
          
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
        timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CartModal handleClose={handleClose}/>
          </Box>
        </Fade>
      </Modal>

      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages.map((page) => (
            <MenuItem key={page} onClick={handleCloseNavMenu}>
              <Typography textAlign="center">{page}</Typography>
            </MenuItem>  
          ))}
        </Menu>
      </Box>
      <Box sx={{ marginLeft: 'auto', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        (page === 'Cart')? 
          <Button
            key={page}
            onClick={handleOpen}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            {page}
          </Button> :
          <Button
            key={page}
            onClick={() => handleSignOut()}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            {page}
          </Button>
      ))}
      </Box>
    </nav>
  )
}

export default NavBar;