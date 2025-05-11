import '../../css/Role.css'
import { Button } from '../Button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Button as Btn, Chip, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Sepolia network parameters
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const SEPOLIA_PARAMS = {
    chainId: SEPOLIA_CHAIN_ID,
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
};

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
    try {
        const ethereum = getEthereumObject();

        if (!ethereum) {
            console.error("Make sure you have Metamask!");
            return null;
        }

        console.log("We have the Ethereum object", ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;
        } else {
            console.error("No authorized account found");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

const Issuer = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [currentNetwork, setCurrentNetwork] = useState("");

    useEffect(() => {
        const init = async () => {
            const account = await findMetaMaskAccount();
            if (account !== null) {
                setCurrentAccount(account);
                checkNetwork();
            }
        };

        init();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                } else {
                    setCurrentAccount("");
                }
            });

            window.ethereum.on('chainChanged', () => {
                checkNetwork();
            });
        }

        return () => {
            // Cleanup listeners
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    const checkNetwork = async () => {
        try {
            const ethereum = getEthereumObject();
            if (ethereum) {
                const chainId = await ethereum.request({ method: 'eth_chainId' });
                setCurrentNetwork(chainId);
                return chainId === SEPOLIA_CHAIN_ID;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const switchToSepolia = async () => {
        try {
            const ethereum = getEthereumObject();
            if (!ethereum) return;

            try {
                // Try to switch to Sepolia
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: SEPOLIA_CHAIN_ID }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [SEPOLIA_PARAMS],
                        });
                    } catch (addError) {
                        console.error(addError);
                    }
                } else {
                    console.error(switchError);
                }
            }

            checkNetwork();
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            const ethereum = getEthereumObject();
            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);

            // Check if we're on Sepolia and switch if needed
            const isOnSepolia = await checkNetwork();
            if (!isOnSepolia) {
                await switchToSepolia();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Format address for display (0x1234...abcd)
    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Check if we're on Sepolia
    const isSepoliaNetwork = currentNetwork === SEPOLIA_CHAIN_ID;

    return (
        <div className="role-container">
            <div className="role-container-box">
                <Box
                    sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                    }}
                >
                    <Btn href="/login" endIcon={<LogoutIcon />}>Logout</Btn>
                </Box>

                <h2>Welcome:</h2>
                <h1>Issuer</h1>

                {currentAccount && (
                    <Box sx={{ mb: 3 }}>
                        <Chip
                            icon={<AccountBalanceWalletIcon />}
                            label={formatAddress(currentAccount)}
                            color="primary"
                            variant="outlined"
                        />
                        {!isSepoliaNetwork && (
                            <Box sx={{ mt: 1 }}>
                                <Typography color="error" variant="body2">
                                    Not connected to Sepolia Test Network
                                </Typography>
                                <Button
                                    className="btns"
                                    buttonStyle='btn--outline'
                                    buttonSize='btn--small'
                                    onClick={switchToSepolia}
                                >
                                    Switch to Sepolia
                                </Button>
                            </Box>
                        )}
                        {isSepoliaNetwork && (
                            <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                                Connected to Sepolia Test Network
                            </Typography>
                        )}
                    </Box>
                )}

                <Link to="/profile">
                    <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large'>Check Profile</Button>
                </Link>

                <Link to="/add-product">
                    <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large'>Add Product</Button>
                </Link>

                {!currentAccount && (
                    <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large' onClick={connectWallet}>Connect Wallet</Button>
                )}

            </div>
        </div>
    );
}

export default Issuer;