import { Chain } from 'wagmi'
 
// export const avalanche = {
//   id: 43_114,
//   name: 'Avalanche',
//   network: 'avalanche',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Avalanche',
//     symbol: 'AVAX',
//   },
//   rpcUrls: {
//     public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
//     default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
//   },
//   blockExplorers: {
//     etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
//     default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
//   },
//   contracts: {
//     multicall3: {
//       address: '0xca11bde05977b3631167028862be2a173976ca11',
//       blockCreated: 11_907_934,
//     },
//   },
// } as const satisfies Chain

export const hedera = {
    id: 295,
    name: "Hedera Mainnet",
    network: "hedera",
    nativeCurrency:{
        decimals: 18,
        name: "Hedera",
        symbol: "HBAR",
    },
    rpcUrls: {
        public: { http: ['https://mainnet.hashio.io/api'] },
        default: { http: ['https://mainnet.hashio.io/api'] },
      },
    blockExplorers: {
        etherscan: { name: 'hederaexplorer', url: 'https://hederaexplorer.io/' },
        default: { name: 'hederaexplorer', url: 'https://hederaexplorer.io/' },
      },
} 