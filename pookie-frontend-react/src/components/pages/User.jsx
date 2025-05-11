import '../../css/Role.css';
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
        decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.org'], // Public Sepolia RPC
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
    try {
        const ethereum = getEthereumObject();
        if (!ethereum) {
            console.error('MetaMask is not installed!');
            return null;
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
            console.log('Found authorized account:', accounts[0]);
            return accounts[0];
        } else {
            console.error('No authorized account found');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

const User = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [currentNetwork, setCurrentNetwork] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const init = async () => {
            const account = await findMetaMaskAccount();
            if (account !== null) {
                setCurrentAccount(account);
                checkNetwork();
            }
        };

        init();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                } else {
                    setCurrentAccount('');
                }
            });

            window.ethereum.on('chainChanged', () => {
                checkNetwork();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        setCurrentAccount(accounts[0]);
                    } else {
                        setCurrentAccount('');
                    }
                });
                window.ethereum.removeListener('chainChanged', checkNetwork);
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
            if (!ethereum) {
                setErrorMessage('MetaMask is not installed.');
                return;
            }

            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: SEPOLIA_CHAIN_ID }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [SEPOLIA_PARAMS],
                        });
                    } catch (addError) {
                        console.error(addError);
                        setErrorMessage('Failed to add Sepolia network.');
                    }
                } else {
                    console.error(switchError);
                    setErrorMessage('Failed to switch to Sepolia network.');
                }
            }

            await checkNetwork();
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred while switching networks.');
        }
    };

    const connectWallet = async () => {
        setIsConnecting(true);
        setErrorMessage('');
        try {
            const ethereum = getEthereumObject();
            if (!ethereum) {
                setErrorMessage('MetaMask is not installed.');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            setCurrentAccount(accounts[0]);

            const isOnSepolia = await checkNetwork();
            if (!isOnSepolia) {
                await switchToSepolia();
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to connect wallet.');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleLogout = () => {
        setCurrentAccount('');
        setCurrentNetwork('');
        window.location.href = '/login';
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const isSepoliaNetwork = currentNetwork === SEPOLIA_CHAIN_ID;

    return (
        <div className="role-container">
            <div className="role-container-box">
                <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                    <Btn onClick={handleLogout} endIcon={<LogoutIcon />}>Logout</Btn>
                </Box>

                <h2>Welcome:</h2>
                <h1>User</h1>

                {errorMessage && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

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
                                    buttonStyle="btn--outline"
                                    buttonSize="btn--small"
                                    onClick={switchToSepolia}
                                    disabled={isConnecting}
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
                    <Button className="btns" buttonStyle="btn--long" buttonSize="btn--large">
                        Check Profile
                    </Button>
                </Link>

                <Link to="/scanner">
                    <Button className="btns" buttonStyle="btn--long" buttonSize="btn--large">
                        Update Product
                    </Button>
                </Link>

                {!currentAccount && (
                    <Button
                        className="btns"
                        buttonStyle="btn--long"
                        buttonSize="btn--large"
                        onClick={connectWallet}
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default User;