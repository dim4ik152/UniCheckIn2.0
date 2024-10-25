// Chain ID для Unichain Holesky
const UNICHAIN_HOLESKY_CHAIN_ID = '0x515'; // Правильный Chain ID

// Функция для проверки наличия MetaMask
function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
}

// Функция для проверки текущей сети
async function checkNetwork() {
    if (!isMetaMaskInstalled()) {
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

// Функция для проверки состояния кошелька
async function checkWalletConnection() {
    if (!isMetaMaskInstalled()) {
        alert('Please install a cryptocurrency wallet like MetaMask.');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            const account = accounts[0];
            document.getElementById('wallet-address').innerText = `Connected: ${account}`;
            console.log('Wallet already connected:', account);
        } else {
            document.getElementById('wallet-address').innerText = 'Wallet is not connected.';
            console.log('Wallet is not connected.');
        }
    } catch (err) {
        console.error('Error checking wallet connection:', err);
    }
}

// Функция для подключения к кошельку
async function connectWallet() {
    if (!isMetaMaskInstalled()) {
        alert('Please install a cryptocurrency wallet like MetaMask.');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        document.getElementById('wallet-address').innerText = `Connected: ${account}`;
        console.log('Connected account:', account);
    } catch (err) {
        console.error('Error connecting to wallet:', err);
    }
}

// Вызов проверки при загрузке страницы
window.addEventListener('load', async () => {
    if (isMetaMaskInstalled()) {
        await checkWalletConnection();
        await checkNetwork();
    } else {
        document.getElementById('wallet-address').innerText = 'Please install a cryptocurrency wallet.';
    }
});

// Привязываем кнопки к функциям
document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('checkInButton').addEventListener('click', checkIn);
