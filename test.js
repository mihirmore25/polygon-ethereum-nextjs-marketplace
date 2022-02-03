const { ethers } = require('hardhat');

const ERC721 = require('./artifacts/contracts/Market.sol/NFTMarket.json'); 
const provider =  new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')

async function listTokensOfOwner(tokenAddress, account) {
  const token = await ethers.getContractAt(
    ERC721.abi,
    tokenAddress,
    provider,
  );

  const sentLogs = await token.queryFilter(
    token.filters.Transfer(account, null),
  );
  const receivedLogs = await token.queryFilter(
    token.filters.Transfer(null, account),
  );

  const logs = sentLogs.concat(receivedLogs)
    .sort(
      (a, b) =>
        a.blockNumber - b.blockNumber ||
        a.transactionIndex - b.transactionIndex,
    );

  const owned = new Set();

  for (const { args: { from, to, tokenId } } of logs) {
    if (addressEqual(to, account)) {
      owned.add(tokenId.toString());
    } else if (addressEqual(from, account)) {
      owned.delete(tokenId.toString());
    }
  }

  return owned;
};

function addressEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}



async function test (token, account ) {
//  console.error(await getTokenName(token), 'tokens owned by', account);
  const owned = await listTokensOfOwner(token, account);
  console.log([...owned].join('\n'));
} 

test('0xb5Ed9cDF8BFbDD5376992F19C8e20e3F5fe569d7' , '0xc4536A5E715D578aEF681Fb84809AE0B7CC408C8')