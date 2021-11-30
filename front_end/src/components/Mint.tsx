import React, { useState } from "react";
import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import {
  Box,
  Button,
  Snackbar,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ConnectionRequiredMsg } from "./ConnectionRequiredMsg";
import FactItem from "../chain-info/FactItem.json";

interface MintProps {
  contractAddresses: Record<string, string>;
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px",
    margin: `${theme.spacing(4)}px 0`,
    padding: theme.spacing(2),
  },
  header: {
    color: "white",
  },
}));

const getFactItemContract = (address: any) => {
  const { abi } = FactItem;
  const contractInterface = new utils.Interface(abi);
  const contract = new Contract(address, contractInterface);
  return contract;
};

export const Mint = ({ contractAddresses }: MintProps) => {
  const classes = useStyles();

  const { account } = useEthers();
  const isConnected = account !== null;

  const [factURL, setFactURL] = useState("");
  const [showMintError, setShowMintError] = useState(false);

  const contract = getFactItemContract(contractAddresses["FactItem"]);
  const { state: stateMint, send: sendMint } = useContractFunction(
    contract,
    "mintItem"
  );

  const handleCloseMintError = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    showMintError && setShowMintError(false);
  };

  const handleFieldChange = (event: any) => {
    setFactURL(event.target.value);
  };
  const handleClick = (event: any) => {
    if (factURL === "") {
      setShowMintError(true);
    } else {
      sendMint(factURL);
    }
    setFactURL("");
  };

  return (
    <Box className={classes.box}>
      <div>
        {isConnected ? (
          <>
            <Box>
              <TextField
                label="Fact URL"
                variant="outlined"
                onChange={handleFieldChange}
              />
            </Box>
            <Box>
              <Button variant="contained" onClick={handleClick}>
                Mint Fact
              </Button>
            </Box>
            <Snackbar
              open={showMintError}
              autoHideDuration={5000}
              onClose={handleCloseMintError}
            >
              <Alert onClose={handleCloseMintError} severity="error">
                Cannot have empty fact URL!
              </Alert>
            </Snackbar>
          </>
        ) : (
          <ConnectionRequiredMsg />
        )}
      </div>
    </Box>
  );
};
