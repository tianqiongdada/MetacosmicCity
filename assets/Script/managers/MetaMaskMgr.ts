import SingletonClass from "../base/SingletonClass";
import EventConst from "../data/EventConst";
import GameData from "../data/GameData";
import { GameUtils } from "../untils/GameUtils";
import EventTargetMgr from "./EventTargetMgr";
import { LoadingPanelMgr } from "./LoadingPanelMgr";
import { TipMgr } from "./TipMgr";

export default class MetaMaskMgr extends SingletonClass {
    // 
    public isConnected: boolean = false;//是否已经链接了浅薄了
    public ethereum: any = null;
    public curAount: number = null;//当前账号
    private _chainId: number = null;
    private _signers: any;
    private _ethers: any;
    private _web3Provider: any;
    private _jsonRpcProvider: any;
    public cstc: number = 0;
    public nbn: number = 0;
    public cstcContrack = null;//cstc代币合约实例化
    public gameContrack = null;//game合约实例化
    public nftContrack = null;//nft 合约实例化
    public pVEPoolContrack = null;//
    public lotteryPoolContrack = null;
    public stakingPoolContrack = null;
    public stakingContrack = null;
    public NFTMarketContrack = null;
    private _cstcAddress: string = "0x78F1a611cceba2fF17EA53570DBee7D43629E8bc";
    private _gameAddress: string = "0x3E680BfF8D5f015756e68c0b8c69b7FDe9c319b6";
    private _nftAddress: string = "0x4dF030e0f948aA30CB8Bd0DAd82B79342950D75D";
    private _pVEPoolAddress: string = "0xa49E4193dF2d74965F7b2E7882d46928d773Db37";
    private _lotteryPoolAddress: string = "0xD38846Cc602ad41B42957254c01464ecB921fa86";
    private _stakingPoolAddress: string = "0x82e9bE2e5A1a7f411Dc332ab11b8726472AD3dF3";
    private _stakingAddress: string = "0xb62e538cE38ABAD3AC2A6712032cB2ad6dFD8268";
    private _NFTMarketAddress: string = "0x0734FF7E1B8EaF578ADCFf9c1494801Ad474D696";
    private _pancakeRouterAddress: string = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
    private _WBNBAddress: string = "0xae13d989dac2f0debff460ac112a837c89baa7cd";

    constructor() {
        super();
        let self = this;
    }


    static ins() {
        return super.ins() as MetaMaskMgr;
    }

    public async init() {
        let self = this;
        self.ethereum = window["ethereum"];
        if (typeof self.ethereum == 'undefined') {
            alert('MetaMask is not installed!');
            return;
        }

        self._ethers = window["ethers"];
        let data = self._ethers.utils.hexDataSlice(self._ethers.utils.id('fee()'), 0, 4);
        console.log("测试数据：" + data);
        async function handleAccountsChanged(accounts) {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== self.curAount) {
                self.curAount = accounts[0];
                EventTargetMgr.ins().emitEvent(EventConst.refresh_adress_view, accounts[0].toString());
                // Do any other work!
                // await self.ethereum
                //     .request({ method: 'eth_chainId' })
                //     .then((chainId) => {
                //         console.log(`hexadecimal string: ${chainId}`);
                //         // console.log(`decimal number: ${parseInt(chainId, 16)}`);
                //         self._chainId = chainId;
                //     })
                //     .catch((error) => {
                //         console.error(`Error fetching chainId: ${error.code}: ${error.message}`);
                //     });
                // const balance = await self.ethereum.request({ method: 'eth_getBalance' });
                // console.log("eth_balance:" + balance);    
                self.isConnected = true;
                const provider = new self._ethers.providers.Web3Provider(self.ethereum);
                // console.log("gasPrice:" + self.ethereum.gasPrice);
                self._web3Provider = provider;
                // self._jsonRpcProvider = await new self._ethers.providers.JsonRpcProvider("https://bsc-dataseed2.binance.org");
                // self._signers = self._jsonRpcProvider.getSigner();
                let blockNum = await provider.getBlockNumber();
                // console.log("blockNum:" + blockNum);
                let balance1 = await provider.getBalance(self.curAount);
                console.log("主币数量:" + balance1);

                // const daiAbi = [
                //     // Some details about the token
                //     "function name() view returns (string)",
                //     "function symbol() view returns (string)",

                //     // Get the account balance
                //     "function balanceOf(address) view returns (uint)",

                //     // Send some of your tokens to someone else
                //     "function transfer(address to, uint amount)",

                //     // An event triggered whenever anyone transfers to someone else
                //     "event Transfer(address indexed from, address indexed to, uint amount)"
                // ];
                const cstcAbi = [{ "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
                self.cstcContrack = new self._ethers.Contract(self._cstcAddress, cstcAbi, self._web3Provider.getSigner());

                let nftAbi = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "string", "name": "uri", "type": "string" }, { "internalType": "uint256", "name": "supply", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "_gameAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "exists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint8", "name": "num", "type": "uint8" }], "name": "mintReserved", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newBaseTokenURI", "type": "string" }], "name": "setBaseURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "tokenByOwner", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "src", "type": "address" }], "name": "updateGameAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
                self.nftContrack = new self._ethers.Contract(self._nftAddress, nftAbi, self._web3Provider.getSigner());

                let pVEPoolAbi = [{ "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "_token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "increaseAllowance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
                self.pVEPoolContrack = new self._ethers.Contract(self._pVEPoolAddress, pVEPoolAbi, self._web3Provider.getSigner());

                let lotteryPoolAbi = [{ "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "_token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "increaseAllowance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
                self.lotteryPoolContrack = new self._ethers.Contract(self._lotteryPoolAddress, lotteryPoolAbi, self._web3Provider.getSigner());

                let stakingPoolAbi = [{ "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "_token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "increaseAllowance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
                self.stakingPoolContrack = new self._ethers.Contract(self._stakingPoolAddress, stakingPoolAbi, self._web3Provider.getSigner());

                let stakingAbi = [{ "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "address", "name": "_nft", "type": "address" }, { "internalType": "address", "name": "_stakingBonusesPool", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint8", "name": "typeId", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "Stake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "rewardAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "Unstake", "type": "event" }, { "inputs": [], "name": "allStakingAddress", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "src", "type": "address" }], "name": "changeTargetToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getStakeTokenIdInfo", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getStakingToken", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nft", "outputs": [{ "internalType": "contract IERC721", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint8", "name": "typeId", "type": "uint8" }], "name": "stake", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stakingBonusesPool", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "target", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "targetAmount", "type": "uint256" }], "name": "unstake", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
                self.stakingContrack = new self._ethers.Contract(self._stakingAddress, stakingAbi, self._web3Provider.getSigner());

                let NFTMarketAbi = [{ "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "address", "name": "_nft", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "BidsOrder", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "CancelOrder", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "CreateOrder", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "bidOrder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "cancelOrder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "src", "type": "address" }], "name": "changeTargetToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "createOrder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "getOrderById", "outputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "purchaser", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "createTime", "type": "uint256" }, { "internalType": "uint256", "name": "transactionTime", "type": "uint256" }], "internalType": "struct CryptosTribeNFTMarket.Order", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nft", "outputs": [{ "internalType": "contract IERC721", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "onSaleTokenList", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "ownerAllToken", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "soldTokenList", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "soldTotal", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "target", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenOnSaleTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
                self.NFTMarketContrack = new self._ethers.Contract(self._NFTMarketAddress, NFTMarketAbi, self._web3Provider.getSigner());


                let gameAbi = [{ "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "address", "name": "_nft", "type": "address" }, { "internalType": "address", "name": "_router", "type": "address" }, { "internalType": "address", "name": "_wbnb", "type": "address" }, { "internalType": "address", "name": "_pveBonusesPool", "type": "address" }, { "internalType": "address", "name": "_lotteryBonusesPool", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "Bonuses", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "num", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "Box", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "LotteryInfo", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "buyLottery", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getAllBox", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getBonusesRecord", "outputs": [{ "components": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "userAmount", "type": "uint256" }, { "internalType": "uint256", "name": "burnAmount", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct CryptosTribeGame.BonusesData", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getBonusesRecordCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getBoxStatus", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getMyBonuses", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "name": "getSwapAmount", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "giveOutBonuses", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "addrList", "type": "address[]" }, { "internalType": "uint256[]", "name": "userAmountList", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "burnAmountList", "type": "uint256[]" }, { "internalType": "bool", "name": "status", "type": "bool" }], "name": "lotteryBonus", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "lotteryBonusesPool", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nft", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }], "name": "openRandomBox", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pveBonusesPool", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "randomBoxBurnTotal", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "router", "outputs": [{ "internalType": "contract IPancakeSwapRouter", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "updateBoxStatus", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "_userAmount", "type": "uint256" }, { "internalType": "uint256", "name": "_burnAmount", "type": "uint256" }], "name": "updatePVEBonuses", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "verifyLotteryStatus", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "wbnb", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];
                self.gameContrack = new self._ethers.Contract(self._gameAddress, gameAbi, self._web3Provider.getSigner());

                // self.cstcContrack.name().then((name) => { console.log("name:" + name) });
                // self.cstcContrack.symbol().then((name) => { console.log("symbol:" + name) });
                // self.cstcContrack.gasPrice().then((name) => { console.log("gasPrice:" + name) });
                // self.cstcContrack.gasLimit().then((name) => { console.log("gasLimit:" + name) });
                let balance = await self.cstcContrack.balanceOf(self.curAount);
                console.log("cstc:" + balance);
                LoadingPanelMgr.ins().removeLoadingPanel();
            }
        }
        await self.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                if (err.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            });
        // try {
        //     // Request account access if needed
        //     //授权
        //     const accounts = await self.ethereum.send('eth_requestAccounts');
        //     self.curAount = accounts.result[0];
        //     console.log("accounts:" + accounts.result[0]);
        //     self.ethereum
        //         .request({ method: 'eth_chainId' })
        //         .then((chainId) => {
        //             // console.log(`hexadecimal string: ${chainId}`);
        //             // console.log(`decimal number: ${parseInt(chainId, 16)}`);
        //             self._chainId = chainId;
        //         })
        //         .catch((error) => {
        //             console.error(`Error fetching chainId: ${error.code}: ${error.message}`);
        //         });
        // } catch (error) {
        //     // User denied account access
        //     console.log("error: User denied account access");
        // }
        // // Example 1: Log chainId
        // console.log(self.ethereum.networkVersion);
        // console.log(self.ethereum.selectedAddress);
        // console.log('MetaMask installed ? ', self.ethereum.isMetaMask);

        // //     // Example 2: Log last block
        // self.ethereum
        //     .request({
        //         method: 'eth_getBlockByNumber',
        //         params: ['latest', true],
        //     })
        //     .then((block) => {
        //         console.log(`Block ${block.number}:`, block);
        //     })
        //     .catch((error) => {
        //         console.error(
        //             `Error fetching last block: ${error.message}.
        //    Code: ${error.code}. Data: ${error.data}`
        //         );
        //     });

        // // Example 3: Log available accounts
        // self.ethereum
        //     .request({ method: 'eth_accounts' })
        //     .then((accounts) => {
        //         console.log(`Accounts:\n${accounts.join('\n')}`);
        //     })
        //     .catch((error) => {
        //         console.error(
        //             `Error fetching accounts: ${error.message}.
        //    Code: ${error.code}. Data: ${error.data}`
        //         );
        //     });

        // // Example 4: Log new blocks
        // self.ethereum
        //     .request({
        //         method: 'eth_subscribe',
        //         params: ['newHeads'],
        //     })
        //     .then((subscriptionId) => {
        //         self.ethereum.on('message', (message) => {
        //             if (message.type === 'eth_subscription') {
        //                 const { data } = message;
        //                 if (data.subscription === subscriptionId) {
        //                     if ('result' in data && typeof data.result === 'object') {
        //                         const block = data.result;
        //                         console.log(`New block ${block.number}:`, block);
        //                     } else {
        //                         console.error(`Something went wrong: ${data.result}`);
        //                     }
        //                 }
        //             }
        //         });
        //     })
        //     .catch((error) => {
        //         console.error(
        //             `Error making newHeads subscription: ${error.message}.
        //    Code: ${error.code}. Data: ${error.data}`
        //         );
        //     });

        // // Example 5: Log when accounts change
        let logAccounts = (accounts) => {
            if (self.curAount != accounts[0]) {
                //切换成为不同的账号就自动刷新浏览器
                location.reload();
            }
            console.log(`Accounts:\n${accounts.join('\n')}`);
        };
        self.ethereum.on('accountsChanged', logAccounts);
        // to unsubscribe
        // self.ethereum.removeListener('accountsChanged', logAccounts);

        // // Example 6: Log if connection ends
        self.ethereum.on('disconnect', (code, reason) => {
            console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        });

        let chainChangedHandler = (chainId: string) => {
            console.log("切换链：" + chainId);
            location.reload();
        }
        self.ethereum.on('chainChanged', chainChangedHandler);
    }


    /**
     * 是否已经授权
     * @returns 
     */
    private checkoutIsHavedGranted(): boolean {
        let self = this;
        if (self.curAount) {
            return true;
        }
        return false;
    }

    /**
     * 获取 小狐狸权限
     */
    public requestPermissions() {
        let self = this;
        self.ethereum
            .request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }],
            })
            .then((permissions) => {
                const accountsPermission = permissions.find(
                    (permission) => permission.parentCapability === 'eth_accounts'
                );
                if (accountsPermission) {
                    console.log('eth_accounts permission successfully requested!');
                }
            })
            .catch((error) => {
                if (error.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    console.log('Permissions needed to continue.');
                } else {
                    console.error(error);
                }
            });
    }


    /**
     * 获取主链金币
     */
    public async sendGetBalance() {
        let self = this;
        try {
            const transactionHash = await self.ethereum.request({
                method: 'eth_getBalance',
                params: [
                    self.curAount,
                    'latest'
                ],
            });
            // Handle the result
            self.nbn = transactionHash;
            console.log(transactionHash);
            return transactionHash;
        } catch (error) {
            console.error(error);
            return null;
        }
    }


    /**
    * 获取主链金币
    */
    public async sendGetCSTCBalance() {
        let self = this;
        let balance = await self.cstcContrack.balanceOf(self.curAount);
        return balance;
    }

    /**
     * 获取盲盒价格数据
     */
    public async getCurrentPrice(num: number) {
        let self = this;
        let price: string;
        if (num == 1) {
            price = "100000000000000000";
        } else if (num == 3) {
            price = "280000000000000000";
        } else {
            alert("参数错误。。。。");
            return;
        }
        let data: any = await self.gameContrack.getSwapAmount([self._WBNBAddress, self._cstcAddress], price);
        return data;
    }


    /**
     * 获取当前战斗奖励数量
     */
    public async getMyBonuses(address: number) {
        let self = this;
        let data: any = await self.gameContrack.getMyBonuses(address);
        return data;
    }


    /**
    * 战斗奖励提现
    */
    public giveOutBonuses(callback: Function): void {
        let self = this;
        self.gameContrack.giveOutBonuses().then((data) => {
            console.log("giveOutBonuses:" + JSON.stringify(data));
            if (callback) {
                callback(true);
            }
        }).catch((err) => {
            console.log("giveOutBonuses:" + JSON.stringify(err));
            if (callback) {
                callback(false)
            }
        });
    }


    /**
   * 代币转bnb
   */
    public async getSwapAmount(price: number) {
        let self = this;
        let num1 = GameUtils.getFNum(price);
        let data: any = await self.gameContrack.getSwapAmount([self._cstcAddress, self._WBNBAddress], num1);
        return data;
    }

    /**
     * 
     * @param num 用户质押 
     * @param callback 回调
     */
    public stake(id: number, num: number, type: number, callback: Function): void {
        let self = this;
        let numStr: string = GameUtils.getFNum((num * (10 ** 18)));
        // console.log("numStr:" + (numStr == "2000000000000000000000"));
        self.cstcContrack.allowance(self.curAount.toString(), self._stakingAddress).then((data) => {
            console.log("allowance:" + JSON.stringify(data));
            let maxUint256 = self._ethers.constants.MaxUint256;
            let allowanceNum: number = Number(data.toHexString());
            if (allowanceNum >= num) {
                self.nftContrack.isApprovedForAll(self.curAount.toString(), self._stakingAddress).then((data) => {
                    console.log("isApprovedForAll:" + data);
                    if (data) {
                        //如果已经授权了
                        self.stakingContrack.stake(id, numStr, type).then((data) => {
                            console.log("stake:" + JSON.stringify(data));
                            data.wait().then((tx) => {
                                if (tx.status == 1) {
                                    //这里通知java
                                    console.log("质押成功");
                                    setTimeout(function () {
                                        if (callback) {
                                            callback(true)
                                        }
                                    }.bind(self), 5000);
                                } else {
                                    console.log("质押成功失败");
                                    if (callback) {
                                        callback(false)
                                    }
                                }
                            }).catch((err) => {
                                console.log("质押失败：" + JSON.stringify(err));
                                if (callback) {
                                    callback(false)
                                }
                            });
                        }).catch((err) => {
                            console.log("stakeErr:" + JSON.stringify(err));
                            // TipMgr.ins().showTextTip("privilege grant failed");
                            LoadingPanelMgr.ins().removeLoadingPanel();
                        });
                    } else {
                        self.nftContrack.setApprovalForAll(self._stakingAddress.toString(), true).then((data) => {
                            console.log("setApprovalForAll:" + JSON.stringify(data));
                            self.stakingContrack.stake(id, numStr, type).then((data) => {
                                console.log("stake:" + JSON.stringify(data));
                                data.wait().then((tx) => {
                                    if (tx.status == 1) {
                                        //这里通知java
                                        console.log("质押成功");
                                        setTimeout(function () {
                                            if (callback) {
                                                callback(true)
                                            }
                                        }.bind(self), 5000);
                                    } else {
                                        console.log("质押成功失败");
                                        if (callback) {
                                            callback(false)
                                        }
                                    }
                                }).catch((err) => {
                                    console.log("质押失败：" + JSON.stringify(err));
                                    if (callback) {
                                        callback(false)
                                    }
                                });
                            }).catch((err) => {
                                console.log("stakeErr:" + JSON.stringify(err));
                                if (callback) {
                                    callback(null);
                                }
                            });
                        }).catch((err) => {
                            console.log("setApprovalForAllErr:" + JSON.stringify(err));
                            LoadingPanelMgr.ins().removeLoadingPanel();
                        })
                    }
                });
            } else {
                // let nimus = maxUint256.sub(1);
                self.cstcContrack.approve(self._stakingAddress.toString(), maxUint256).then((data) => {
                    console.log("approve:" + JSON.stringify(data));
                    self.nftContrack.isApprovedForAll(self.curAount.toString(), self._stakingAddress).then((data) => {
                        console.log("isApprovedForAll:" + data);
                        if (data) {
                            //如果已经授权了
                            self.stakingContrack.stake(id, numStr, type).then((data) => {
                                console.log("stake:" + JSON.stringify(data));
                                data.wait().then((tx) => {
                                    if (tx.status == 1) {
                                        //这里通知java
                                        console.log("质押成功");
                                        setTimeout(function () {
                                            if (callback) {
                                                callback(true)
                                            }
                                        }.bind(self), 5000);
                                    } else {
                                        console.log("质押成功失败");
                                        if (callback) {
                                            callback(false)
                                        }
                                    }
                                }).catch((err) => {
                                    console.log("质押失败：" + JSON.stringify(err));
                                    if (callback) {
                                        callback(false)
                                    }
                                });
                            }).catch((err) => {
                                console.log("stakeErr:" + JSON.stringify(err));
                                // TipMgr.ins().showTextTip("privilege grant failed");
                                LoadingPanelMgr.ins().removeLoadingPanel();
                            });
                        } else {
                            self.nftContrack.setApprovalForAll(self._stakingAddress.toString(), true).then((data) => {
                                console.log("setApprovalForAll:" + JSON.stringify(data));
                                self.stakingContrack.stake(id, numStr, type).then((data) => {
                                    console.log("stake:" + JSON.stringify(data));
                                    data.wait().then((tx) => {
                                        if (tx.status == 1) {
                                            //这里通知java
                                            console.log("质押成功");
                                            setTimeout(function () {
                                                if (callback) {
                                                    callback(true)
                                                }
                                            }.bind(self), 5000);
                                        } else {
                                            console.log("质押成功失败");
                                            if (callback) {
                                                callback(false)
                                            }
                                        }
                                    }).catch((err) => {
                                        console.log("质押失败：" + JSON.stringify(err));
                                        if (callback) {
                                            callback(false)
                                        }
                                    });
                                }).catch((err) => {
                                    console.log("stakeErr:" + JSON.stringify(err));
                                    // TipMgr.ins().showTextTip("privilege grant failed");
                                    LoadingPanelMgr.ins().removeLoadingPanel();
                                });
                            }).catch((err) => {
                                console.log("setApprovalForAllErr:" + JSON.stringify(err));
                                LoadingPanelMgr.ins().removeLoadingPanel();
                            })
                        }
                    });
                }).catch((err) => {
                    console.log("approveErr:" + JSON.stringify(err));
                    LoadingPanelMgr.ins().removeLoadingPanel();
                });
            }

        }).catch((err) => {
            console.log("allowanceErr:" + JSON.stringify(err));
            if (callback) {
                callback(null);
            }
        })


        //先查询nft合约 ownerOf 
        // self.nftContrack.approve(self.curAount, id).then((data) => {
        //     console.log("stakeApprove:" + JSON.stringify(data));
        //     self.stakingContrack.stake(id, num).then((data) => {
        //         console.log("stake:" + JSON.stringify(data));
        //         data.wait().then((tx) => {
        //             if (tx.status == 1) {
        //                 //
        //                 console.log("质押成功");
        //                 if (callback) {
        //                     callback(true)
        //                 }
        //             } else {
        //                 console.log("质押成功失败");
        //                 if (callback) {
        //                     callback(false)
        //                 }
        //             }
        //         }).catch((err) => {
        //             console.log("质押失败：" + JSON.stringify(err));
        //             if (callback) {
        //                 callback(false)
        //             }
        //         });
        //     }).catch((err) => {
        //         console.log("stakeErr:" + JSON.stringify(err));
        //         if (callback) {
        //             callback(null);
        //         }
        //     });
        // }).catch((err) => {
        //     console.log("stakeApproveErr:" + JSON.stringify(err));
        //     if (callback) {
        //         callback(null);
        //     }
        // });
    }

    /**
     * 查询质押列表
     */
    public async getStakedList() {
        let self = this;
        let data: any = await self.stakingContrack.getStakingToken(self.curAount.toString());
        console.log("getStakingList:" + JSON.stringify(data));
        return data;
    }


    /**
     * 彩票购买
     * @param totalConsume  总的下注金额 传给链上的
     * @param lotteryArr   总的下注列表数据，传给java的
     */
    public buyLottery(timestamp, totalConsume: number, lotteryArr: any[], callback: Function): void {
        let self = this;
        // console.log("timestamp:" + timestamp + "totalConsume:" + totalConsume);
        let strNum: string = GameUtils.getFNum((totalConsume * (10 ** 18)));
        console.log("质押金额:" + strNum)

        let callback1: Function = function (data) {
            console.log(JSON.stringify(data));
            self.cstcContrack.allowance(self.curAount.toString(), self._gameAddress).then((data) => {
                console.log("allowance:" + JSON.stringify(data));
                let maxUint256 = self._ethers.constants.MaxUint256;
                let allowanceNum: number = Number(data.toHexString());
                if (totalConsume <= allowanceNum) {
                    self.gameContrack.buyLottery(strNum, timestamp).then((data) => {
                        console.log("buyLottery:" + JSON.stringify(data));
                        // data.wait().then((tx) => {
                        //     if (tx.status == 1) {
                        //         console.log("下注成功"); //这里跟java同步
                        //         if (callback) {
                        //             callback(true)
                        //         }
                        //     } else {
                        //         console.log("下注失败");
                        //         if (callback) {
                        //             callback(false)
                        //         }
                        //     }
                        // }).catch((err) => {
                        //     console.log("下注失败：" + JSON.stringify(err));
                        //     if (callback) {
                        //         callback(false)
                        //     }
                        // });
                        self.gameContrack.verifyLotteryStatus(self.curAount.toString(), timestamp).then((data) => {
                            console.log("verifyLotteryStatus:" + JSON.stringify(data));
                            LoadingPanelMgr.ins().removeLoadingPanel()
                            if (data) {
                                console.log("下注成功");
                            }
                        }).catch((err) => {
                            LoadingPanelMgr.ins().removeLoadingPanel()
                            console.log("verifyLotteryStatusErr:" + JSON.stringify(err));
                            if (callback) {
                                callback(null);
                            }
                        });

                    }).catch((err) => {
                        LoadingPanelMgr.ins().removeLoadingPanel()
                        console.log("buyLotteryErr:" + JSON.stringify(err));
                        if (callback) {
                            callback(null);
                        }
                    });
                } else {
                    self.cstcContrack.approve(self._gameAddress.toString(), maxUint256).then((data) => {
                        console.log("buyLotteryApprove:" + JSON.stringify(data));
                        self.gameContrack.buyLottery(strNum, timestamp).then((data) => {
                            console.log("buyLottery:" + JSON.stringify(data));
                            // data.wait().then((tx) => {
                            //     if (tx.status == 1) {
                            //         console.log("下注成功"); //这里跟java同步
                            //         if (callback) {
                            //             callback(true)
                            //         }
                            //     } else {
                            //         console.log("下注失败");
                            //         if (callback) {
                            //             callback(false)
                            //         }
                            //     }
                            // }).catch((err) => {
                            //     console.log("下注失败：" + JSON.stringify(err));
                            //     if (callback) {
                            //         callback(false)
                            //     }
                            // });
                            self.gameContrack.verifyLotteryStatus(self.curAount.toString(), timestamp).then((data) => {
                                console.log("verifyLotteryStatus:" + JSON.stringify(data));
                                LoadingPanelMgr.ins().removeLoadingPanel()
                                if (data) {
                                    console.log("下注成功");
                                }
                            }).catch((err) => {
                                LoadingPanelMgr.ins().removeLoadingPanel()
                                console.log("verifyLotteryStatusErr:" + JSON.stringify(err));
                                if (callback) {
                                    callback(null);
                                }
                            });

                        }).catch((err) => {
                            LoadingPanelMgr.ins().removeLoadingPanel()
                            console.log("buyLotteryErr:" + JSON.stringify(err));
                            if (callback) {
                                callback(null);
                            }
                        });
                    }).catch((err) => {
                        console.log("buyLotteryAllowanceErr:" + JSON.stringify(err));
                        LoadingPanelMgr.ins().removeLoadingPanel();
                    });
                }

            });
        }.bind(self);

    }


    /**
     * 购买卡片
     * @param id  卡牌id
     * @param callback 
     */
    public buyCards(price: number, id: number, callback: Function): void {
        let self = this;
        self.cstcContrack.allowance(self.curAount.toString(), self._NFTMarketAddress).then((data) => {
            let allowanceNum: number = Number(data.toHexString());
            let maxUint256 = self._ethers.constants.MaxUint256;
            if (price <= allowanceNum) {
                //无需授权
                self.NFTMarketContrack.bidOrder(id).then((data) => {
                    console.log("buyCards:" + JSON.stringify(data));
                    data.wait().then((tx) => {
                        if (tx.status == 1) {
                            console.log("购买卡牌成功"); //这里跟java同步
                            setTimeout(function () {
                                if (callback) {
                                    callback(true)
                                }
                            }.bind(self), 5000);
                        } else {
                            console.log("购买卡牌失败");
                            if (callback) {
                                callback(false)
                            }
                        }
                    }).catch((err) => {
                        console.log("购买卡牌失败：" + JSON.stringify(err));
                        if (callback) {
                            callback(false)
                        }
                    });
                }).catch((err) => {
                    console.log("bidOrderErr:" + JSON.stringify(err));
                    if (callback) {
                        callback(null);
                    }
                });
            } else {
                // let nimus = maxUint256.sub(1);
                self.cstcContrack.approve(self._NFTMarketAddress.toString(), maxUint256).then((data) => {
                    console.log("approve:" + JSON.stringify(data));
                    self.NFTMarketContrack.bidOrder(id).then((data) => {
                        console.log("buyCards:" + JSON.stringify(data));
                        data.wait().then((tx) => {
                            if (tx.status == 1) {
                                console.log("购买卡牌成功"); //这里跟java同步
                                if (callback) {
                                    callback(true)
                                }
                            } else {
                                console.log("购买卡牌失败");
                                if (callback) {
                                    callback(false)
                                }
                            }
                        }).catch((err) => {
                            console.log("购买卡牌失败：" + JSON.stringify(err));
                            if (callback) {
                                callback(false)
                            }
                        });
                    }).catch((err) => {
                        console.log("bidOrderErr:" + JSON.stringify(err));
                        if (callback) {
                            callback(null);
                        }
                    });
                }).catch((err) => {
                    console.log("approveErr:" + JSON.stringify(err));
                    LoadingPanelMgr.ins().removeLoadingPanel();
                });
            }
            console.log("allowance:" + JSON.stringify(data));


        }).catch((err) => {
            console.log("allowanceErr:" + JSON.stringify(err));
            if (callback) {
                callback(null);
            }
        })


    }


    /**
    * 上架 出售卡牌
    * @param id  卡牌id
    * @param callback 
    * @param price 价格 
    */
    public createOrder(id: number, price: number, callback: Function): void {
        let self = this;
        let priceStr: string = GameUtils.getFNum((price * (10 ** 18)));
        console.log("质押priceStr:" + priceStr);
        self.nftContrack.isApprovedForAll(self.curAount.toString(), self._NFTMarketAddress).then((data) => {
            console.log("isApprovedForAll:" + data);
            if (data) {
                //如果已经授权了
                self.NFTMarketContrack.createOrder(id, priceStr).then((data) => {
                    console.log("createOrder:" + JSON.stringify(data));
                    data.wait().then((tx) => {
                        if (tx.status == 1) {
                            console.log("上架成功");
                            setTimeout(function () {
                                if (callback) {
                                    callback(true)
                                }
                            }.bind(self), 5000);
                        } else {
                            console.log("上架失败");
                            if (callback) {
                                callback(false)
                            }
                        }
                    }).catch((err) => {
                        console.log("上架失败：" + JSON.stringify(err));
                        if (callback) {
                            callback(false)
                        }
                    });
                }).catch((err) => {
                    console.log("createOrderErr:" + JSON.stringify(err));
                    // TipMgr.ins().showTextTip("privilege grant failed");
                    LoadingPanelMgr.ins().removeLoadingPanel();
                });
            } else {
                self.nftContrack.setApprovalForAll(self._NFTMarketAddress.toString(), true).then((data) => {
                    console.log("setApprovalForAll:" + JSON.stringify(data));
                    self.NFTMarketContrack.createOrder(id, priceStr).then((data) => {
                        console.log("createOrder:" + JSON.stringify(data));
                        data.wait().then((tx) => {
                            if (tx.status == 1) {
                                console.log("上架成功");
                                setTimeout(function () {
                                    if (callback) {
                                        callback(true)
                                    }
                                }.bind(self), 5000);

                            } else {
                                console.log("上架失败");
                                if (callback) {
                                    callback(false)
                                }
                            }
                        }).catch((err) => {
                            console.log("上架失败：" + JSON.stringify(err));
                            if (callback) {
                                callback(false)
                            }
                        });
                    }).catch((err) => {
                        console.log("createOrderErr:" + JSON.stringify(err));
                        // TipMgr.ins().showTextTip("privilege grant failed");
                        LoadingPanelMgr.ins().removeLoadingPanel();
                    });
                }).catch((err) => {
                    console.log("setApprovalForAllErr:" + JSON.stringify(err));
                    // if (callback) {
                    //     callback(null);
                    // }
                    LoadingPanelMgr.ins().removeLoadingPanel();
                })
            }
        });
    }

    /**
     * 上架 出售卡牌
     * @param id  卡牌id
     * @param callback 
     * @param price 价格 
     */
    public cancelOrder(id: number, callback: Function): void {
        let self = this;
        self.NFTMarketContrack.cancelOrder(id).then((data) => {
            console.log("cancelOrder:" + JSON.stringify(data));
            data.wait().then((tx) => {
                if (tx.status == 1) {
                    console.log("下架成功");
                    setTimeout(function () {
                        if (callback) {
                            callback(true)
                        }
                    }.bind(self), 5000);
                } else {
                    console.log("下架失败");
                    if (callback) {
                        callback(false)
                    }
                }
            }).catch((err) => {
                console.log("下架失败：" + JSON.stringify(err));
                if (callback) {
                    callback(false)
                }
            });
        }).catch((err) => {
            console.log("cancelOrderErr:" + JSON.stringify(err));
            if (callback) {
                callback(null);
            }
        });
    }


    /**
    //  * 获取市场列表
     * @param callback 
        @param type  1 已售卖 2 在售卖
     */
    public getMarketList(type: number, callback: Function): void {
        let self = this;
        if (type == 1) {
            self.NFTMarketContrack.soldTokenList().then((data) => {
                console.log("soldTokenList:" + JSON.stringify(data));
                if (callback) {
                    callback(data);
                }
            }).catch((err) => {
                console.log("soldTokenListErr:" + JSON.stringify(err));
                if (callback) {
                    callback(null);
                }
            });
        } else if (type == 2) {
            self.NFTMarketContrack.onSaleTokenList().then((data) => {
                console.log("onSaleTokenList:" + JSON.stringify(data));
                if (callback) {
                    callback(data);
                }
            }).catch((err) => {
                console.log("onSaleTokenListErr:" + JSON.stringify(err));
                if (callback) {
                    callback(null);
                }
            });
        }

    }

    /**
     * 查看盒子状态
     * @param curAount 
     */
    public boxStatus(curAount: string) {
        let self = this;
        self.gameContrack.getBoxStatus(self.curAount.toString()).then((data) => {
            console.log("getBoxStatus:" + JSON.stringify(data));
        }).catch((err) => {
            console.log("openRandomBoxErr:" + JSON.stringify(err));
        });
    }

    /**
     * 打开盲盒 只能传1 或者是3 不然会报错 
     */
    public openRandomBox(price: string, num: number, callback: Function) {
        let self = this;
        let callback1: Function = function (data: any): void {
            let self = this;
            console.log("java Data:" + JSON.stringify(data));
            self.gameContrack.getBoxStatus(self.curAount.toString()).then((data) => {
                console.log("getBoxStatus:" + JSON.stringify(data));
                if (data[0]) {
                    //成功 这是通知java
                    // TipMgr.ins().showTextTip("当前存在打开的盒子........");
                    console.log("当前存在打开的盒子........");
                    // if (callback) {
                    //     callback(false)
                    // }
                    LoadingPanelMgr.ins().removeLoadingPanel();
                } else {
                    self.cstcContrack.allowance(self.curAount.toString(), self._gameAddress).then((data) => {
                        console.log("allowance:" + JSON.stringify(data));
                        let maxUint256 = self._ethers.constants.MaxUint256;
                        let nimus = maxUint256.sub(1);
                        let allowanceNum: number = Number(data.toHexString());
                        if (Number(price) <= allowanceNum) {
                            //无需授权
                            self.gameContrack.openRandomBox(num, { gasPrice: 10000000000, gasLimit: 9000000 }).then((data) => {
                                console.log("openRandomBox:" + JSON.stringify(data));
                                data.wait().then((tx) => {
                                    if (tx.status == 1) {
                                        console.log("打开成箱子成功");
                                        setTimeout(function () {
                                            EventTargetMgr.ins().emitEvent(EventConst.update_topView);
                                        }.bind(self), 1000);
                                        // self.gameContrack.getBoxStatus(self.curAount.toString()).then((data) => {
                                        //     console.log("getBoxStatus:" + JSON.stringify(data));
                                        //     if (data[0]) {
                                        //         //成功 这里通知java

                                        //     } else {
                                        //         if (callback) {
                                        //             callback(false)
                                        //         }
                                        //     }

                                        // }).catch((err) => {
                                        //     console.log("openRandomBoxErr:" + JSON.stringify(err));
                                        //     if (callback) {
                                        //         callback(null);
                                        //     }
                                        // });
                                    } else {
                                        console.log("打开成箱子失败");
                                        if (callback) {
                                            callback(false)
                                        }
                                    }
                                }).catch((err) => {
                                    console.log("打开箱子失败：" + JSON.stringify(err));
                                    if (callback) {
                                        callback(false)
                                    }
                                });
                            }).catch((err) => {
                                console.log("openRandomBoxErr:" + JSON.stringify(err));
                                LoadingPanelMgr.ins().removeLoadingPanel();
                            });
                        } else {
                            self.cstcContrack.approve(self._gameAddress.toString(), maxUint256).then((data) => {
                                console.log("approve:" + JSON.stringify(data));
                                self.gameContrack.openRandomBox(num, { gasPrice: 10000000000, gasLimit: 9000000 }).then((data) => {
                                    console.log("openRandomBox:" + JSON.stringify(data));
                                    data.wait().then((tx) => {
                                        if (tx.status == 1) {
                                            console.log("打开成箱子成功");
                                            setTimeout(function () {
                                                EventTargetMgr.ins().emitEvent(EventConst.update_topView);
                                            }.bind(self), 1000);
                                            // self.gameContrack.getBoxStatus(self.curAount.toString()).then((data) => {
                                            //     console.log("getBoxStatus:" + JSON.stringify(data));
                                            //     if (data[0]) {
                                            //         //成功 这里通知java

                                            //     } else {
                                            //         if (callback) {
                                            //             callback(false)
                                            //         }
                                            //     }
                                            // }).catch((err) => {
                                            //     console.log("openRandomBoxErr:" + JSON.stringify(err));
                                            //     if (callback) {
                                            //         callback(null);
                                            //     }
                                            // });
                                        } else {
                                            console.log("打开成箱子失败");
                                            if (callback) {
                                                callback(false)
                                            }
                                        }
                                    }).catch((err) => {
                                        console.log("打开箱子失败：" + JSON.stringify(err));
                                        if (callback) {
                                            callback(false)
                                        }
                                    });
                                }).catch((err) => {
                                    console.log("openRandomBoxErr:" + JSON.stringify(err));
                                    LoadingPanelMgr.ins().removeLoadingPanel();
                                });
                            }).catch((err) => {
                                console.log("approveErr:" + JSON.stringify(err));
                                LoadingPanelMgr.ins().removeLoadingPanel();
                            });
                        }
                    }).catch((err) => {
                        console.log("allowanceErr:" + JSON.stringify(err));
                        // if (callback) {
                        //     callback(null);
                        // }
                        LoadingPanelMgr.ins().removeLoadingPanel();
                    })
                }

            }).catch((err) => {
                console.log("boxStatusErr:" + JSON.stringify(err));
                LoadingPanelMgr.ins().removeLoadingPanel();
            });
        }.bind(self);
    }

}

window["MetaMaskMgr"] = MetaMaskMgr.ins();
