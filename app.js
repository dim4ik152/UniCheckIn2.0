// Chain ID для Unichain Holesky
const UNICHAIN_HOLESKY_CHAIN_ID = '0x515'; // Правильный Chain ID

// Функция для проверки текущей сети
async function checkNetwork() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install a cryptocurrency wallet like MetaMask.');
        return;
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    if (chainId !== parseInt(UNICHAIN_HOLESKY_CHAIN_ID, 16)) {
        try {
            await switchNetwork();
        } catch (error) {
            alert('Please switch to the Unichain Holesky network.');
        }
    }
}

// Функция для переключения сети
async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: UNICHAIN_HOLESKY_CHAIN_ID }]
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: UNICHAIN_HOLESKY_CHAIN_ID,
                            chainName: 'Unichain Holesky',
                            rpcUrls: ['https://sepolia.unichain.org'],
                            nativeCurrency: {
                                name: 'UNI',
                                symbol: 'UNI',
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://unichain-sepolia.blockscout.com/']
                        }
                    ]
                });
            } catch (addError) {
                console.error('Failed to add network:', addError);
            }
        }
    }
}

// Функция для проверки состояния кошелька
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const account = accounts[0];
                document.getElementById('wallet-address').innerText = `Connected: ${account}`;
                console.log('Wallet already connected:', account);
            } else {
                console.log('Wallet is not connected.');
            }
        } catch (err) {
            console.error('Error checking wallet connection:', err);
        }
    } else {
        alert('Please install a cryptocurrency wallet like MetaMask.');
    }
}

// Функция для подключения к кошельку
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            document.getElementById('wallet-address').innerText = `Connected: ${account}`;
            console.log('Connected account:', account);
        } catch (err) {
            console.error('Error connecting to wallet:', err);
        }
    } else {
        alert('Please install a cryptocurrency wallet like MetaMask.');
    }
}

// Функция для выполнения Check In
async function checkIn() {
    await checkNetwork();

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = '0x35010ff1e222Ba9a11a79768188661D2bcBd9f74';
        const contractABI = [
            "function checkIn() payable"
        ];

        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.checkIn({
                value: ethers.utils.parseEther('0.0001')
            });
            console.log('Transaction submitted:', tx);
            await tx.wait();
            console.log('Transaction confirmed:', tx);
        } catch (err) {
            console.error('Transaction failed:', err);
        }
    } else {
        alert('Please connect your wallet first.');
    }
}

// Вызов проверки при загрузке страницы
window.addEventListener('load', async () => {
    await checkWalletConnection();
    await checkNetwork();

    // Если MetaMask отключается при обновлении, просим подключить его снова
    if (!document.getElementById('wallet-address').innerText.includes('Connected')) {
        document.getElementById('wallet-address').innerText = 'Please connect your wallet.';
    }
});

// Привязываем кнопки к функциям
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('checkInButton').addEventListener('click', checkIn);
