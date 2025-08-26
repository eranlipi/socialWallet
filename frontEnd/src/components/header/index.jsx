import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import MoreIcon from "@material-ui/icons/MoreVert";
import api from "../../helpers/api";
import { logout } from "../../auth";
import { AlertContext } from "../../Routes";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
  grow: {
    flexGrow: 1,
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
  },
  linkMobileText: {
    marginLeft: 4,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    flexGrow: 1,
    position: "relative",
    justifyContent: "center",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#fff",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.primary.main,
  },
  inputRoot: {
    color: theme.palette.primary,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    color: theme.palette.primary.main,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "80%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  navText: {
    marginLeft: 10,
    height: "100%",
    fontSize: 20,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleLogout = () => {
    api.auth.logout().then((res) => {
      if (res.type === "success") {
        setAlertMsg(res.msg);
        setAlertType("success");
        setAlertOpen(true);
        logout();
        navigate("/signin");
      } else {
        setAlertMsg(res.msg);
        setAlertType("error");
        setAlertOpen(true);
      }
    });
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Cards</MenuItem>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link to="/" className={classes.link}>
          <IconButton>
            <HomeIcon />
            <p className={classes.linkMobileText}>Home</p>
          </IconButton>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to="/cards" className={classes.link}>
          <IconButton>
            <PeopleIcon />
            <p className={classes.linkMobileText}>Cards</p>
          </IconButton>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to="#" className={classes.link}>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
            <p className={classes.linkMobileText}>Sign out</p>
          </IconButton>
        </Link>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Typography className={classes.title} variant="h4" noWrap>
            S
          </Typography>
          <div className={classes.sectionDesktop}>
            <Link to="/" className={classes.link}>
              <IconButton color="inherit">
                <HomeIcon />
                <p className={classes.navText}>Home</p>
              </IconButton>
            </Link>
            <Link to="/cards" className={classes.link}>
              <IconButton color="inherit" className={classes.link}>
                <PeopleIcon />
                <p className={classes.navText}>Cards</p>
              </IconButton>
            </Link>
            <Link to="#" className={classes.link}>
              <IconButton onClick={handleLogout} color="inherit">
                <LogoutIcon />
                <p className={classes.navText}>Sign out</p>
              </IconButton>
            </Link>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
