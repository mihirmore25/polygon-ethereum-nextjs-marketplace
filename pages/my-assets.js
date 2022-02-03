import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios' 
import { useRouter } from 'next/router'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([]) 
  const [ownedNfts, setOwnedNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')  
  const router = useRouter()


  useEffect(() => {
    loadNFTs()  
    loadNFTs2()

  }, [])  

  async function loadNFTs2() {   

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()  
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider) 

    let data  = await tokenContract.walletOfOwner(provider.provider.selectedAddress)

    data = data.map(e => { return e.toNumber()}) 

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i)
      const meta = await axios.get(tokenUri)
  //    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        tokenContract : {address : nftaddress } ,
        tokenId: i ,
        image: meta.data.image,
      }
      return item
    })) 

    setOwnedNfts(items)
    


  }

  

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
   
    

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchMyNFTs()
        
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }    

  async function listForSale(nft)  {
    try {
      console.log('listForSale : ' , nft)  

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)       
    const signer = provider.getSigner()

    /* then list the item for sale on the marketplace */
    let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString() 

    console.log(nft.tokenContract.address.toString()) 
    console.log(nft.tokenId) 
    let aprice = ethers.utils.parseUnits('0.001', 'ether')
    console.log( aprice);

    //tokenid to be corrected 
    let transaction = await contract.createMarketItem(nft.tokenContract.address.toString() , nft.tokenId , aprice , { value: listingPrice })
    await transaction.wait() 
    router.push('/') 

    } catch (error) {
      console.log(error)
    }

  } 

    async function listForAuction(nft) {
    console.log('listForAuction : ' , nft )   
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)       
    const signer = provider.getSigner()   

   

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer) 
    let tx = await tokenContract.setApprovalForAll(auction , true )
    await tx.wait() 

    let contract = new ethers.Contract(auction, Auction.abi, signer)   
    let auctionEnd  = Math.floor(new Date().getTime() / 1000) + 86400  
    let aprice = ethers.utils.parseUnits(nft.price, 'ether')
    console.log( aprice);

    let transaction = await contract.createAuction(nft.tokenContract.address.toString() , tokenId.tokenId , aprice ,auctionEnd )
    await transaction.wait() 

    console.log(" pushed to auction " ) 

    
  }


  if (loadingState === 'loaded' && !ownedNfts.length )  return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    <>
      {/* <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>   */}


    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            ownedNfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - Eth</p>
                </div> 

                <button onClick={() => listForAuction(nft)} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg mr-2">
                    Auction
                  </button> 
                  <span className='font-bold' >Or</span>
                  <button  onClick={() => listForSale(nft) }  className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg ml-2 ">
                    List
                  </button> 
              </div>
            ))
          }
        </div>
      </div>
    </div> 
    
    
    </>



  )
} 


/*

<button onClick={() => listForAuction(nft)} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg mr-2">
                    Auction
                  </button> 
                  <span className='font-bold' >Or</span>
                  <button  onClick={() => listForSale(nft) }  className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg ml-2 ">
                    List
                  </button> 

*/