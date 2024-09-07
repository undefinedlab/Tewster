import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK, ADAPTER_EVENTS } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3Auth } from '@web3auth/modal';
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import Web3 from 'web3';

const clientId = "BBP-UuLBs-tTUxp4PwAtS2nQPW25oSLXUfAEg7H-FqTD9LOyMVgTlFDFEJLoMj2nij51yvRRCvYYeQnptrOYR_E";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x15B32",
  rpcTarget: "https://chiliz-spicy.publicnode.com",
  displayName: "Chiliz Spicy Testnet",
  blockExplorerUrl: "https://testnet.chiliscan.com/",
  ticker: "CHZ",
  tickerName: "Chiliz",
  logo: "https://cryptologos.cc/logos/chiliz-chz-logo.svg?v=002",
};

interface UserContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  user: any;
  isLoggedIn: boolean;
  walletAddress: string;
  chainId: string;
  balance: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  showWalletUI: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        const coinbaseAdapter = new CoinbaseAdapter({
          clientId,
          sessionTime: 3600,
          chainConfig,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
        });

        web3authInstance.configureAdapter(coinbaseAdapter);

        const walletServicesPluginInstance = new WalletServicesPlugin({
          walletInitOptions: {
            whiteLabel: {
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            },
          },
        });

        web3authInstance.addPlugin(walletServicesPluginInstance);
        setWalletServicesPlugin(walletServicesPluginInstance);

        setWeb3auth(web3authInstance);
        await web3authInstance.initModal();

        if (web3authInstance.connected) {
          await handleUserConnection(web3authInstance);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (web3auth) {
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async () => {
        await handleUserConnection(web3auth);
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, handleDisconnection);

      return () => {
        web3auth.off(ADAPTER_EVENTS.CONNECTED);
        web3auth.off(ADAPTER_EVENTS.DISCONNECTED);
      };
    }
  }, [web3auth]);

  const handleUserConnection = async (web3authInstance: Web3Auth) => {
    try {
      const provider = await web3authInstance.provider;
      if (!provider) throw new Error("No provider available");

      setProvider(provider);
      const web3 = new Web3(provider as any);
      
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) throw new Error("No accounts found");
      
      const address = accounts[0];
      setWalletAddress(address);
      
      const balance = web3.utils.fromWei(await web3.eth.getBalance(address), "ether");
      setBalance(balance);
      
      const chainId = await web3.eth.getChainId();
      setChainId('0x' + chainId.toString(16));
      
      const userInfo = await web3authInstance.getUserInfo();
      setUser(userInfo);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error handling user connection:", error);
      handleDisconnection();
    }
  };

  const handleDisconnection = () => {
    setIsLoggedIn(false);
    setUser(null);
    setWalletAddress('');
    setChainId('');
    setBalance('');
    setProvider(null);
  };

  const login = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized yet");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      await handleUserConnection(web3auth);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized yet");
      return;
    }
    await web3auth.logout();
    handleDisconnection();
  };

  const showWalletUI = async () => {
    if (walletServicesPlugin) {
      try {
        await walletServicesPlugin.showWalletUi(); 
        console.log("Wallet UI called successfully");
      } catch (error) {
        console.error("Error showing wallet UI:", error);
      }
    } else {
      console.error("Wallet Services Plugin is not initialized");
    }
  };


  return (
    <UserContext.Provider value={{ 
      web3auth, 
      provider, 
      user, 
      isLoggedIn, 
      walletAddress, 
      chainId, 
      balance, 
      login, 
      logout, 
      showWalletUI 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};