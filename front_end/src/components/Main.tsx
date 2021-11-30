/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Typography,
  Snackbar,
  Tab,
  Tabs,
  AppBar,
  Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEthers } from "@usedapp/core";
import { constants } from "ethers";
import networkMapping from "../chain-info/map.json";
import helperConfig from "../helper-config.json";
import { Mint } from "./Mint";
import { Vote } from "./Vote";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4),
  },
}));

export const Main = () => {
  const classes = useStyles();

  const { chainId, error } = useEthers();
  console.log(typeof chainId);

  const networkName = chainId ? helperConfig[String(chainId)] : "ganache";
  const factItemAddress = chainId
    ? networkMapping[String(chainId)]["FactItem"]
    : constants.AddressZero;
  const voteMgrAddress = chainId
    ? networkMapping[String(chainId)]["VoteManager"]
    : constants.AddressZero;
  const contractAddresses = {
    FactItem: factItemAddress,
    VoteManager: voteMgrAddress,
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (_: any, newValue: any) => {
    setValue(newValue);
  };

  const [showNetworkError, setShowNetworkError] = useState(false);

  const handleCloseNetworkError = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    showNetworkError && setShowNetworkError(false);
  };

  useEffect(() => {
    if (error && error.name === "UnsupportedChainIdError") {
      !showNetworkError && setShowNetworkError(true);
    } else {
      showNetworkError && setShowNetworkError(false);
    }
  }, [error, showNetworkError]);

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        classes={{
          root: classes.title,
        }}
      >
        DECENTRAFACT
      </Typography>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="decentrafact tabs"
        >
          <Tab label="MINT" {...a11yProps(0)} />
          <Tab label="VOTE" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Mint contractAddresses={contractAddresses} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Vote contractAddresses={contractAddresses} />
      </TabPanel>
      <Snackbar
        open={showNetworkError}
        autoHideDuration={5000}
        onClose={handleCloseNetworkError}
      >
        <Alert onClose={handleCloseNetworkError} severity="warning">
          You gotta connect to the Kovan or Rinkeby network!
        </Alert>
      </Snackbar>
    </>
  );
};
