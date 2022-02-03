const { expect } = require("chai");
const { ethers } = require("hardhat");  
//const { expectRevert } = require('@openzeppelin/test-helpers');
const hre = require("hardhat");

describe("AuctionNFT", function () { 
 
  let accounts = [] 
  let mockNFT 
  let auction    


  before(async function()  { 
        acc = await  hre.ethers.getSigners() 
        for (const account of acc){
          accounts.push(account.address) 
        }     

        let factory2 = await hre.ethers.getContractFactory("MockNFT") 
        let contractInstance2 = await factory2.deploy() 
        mockNFT  = await contractInstance2.deployed()  

        
        let factory = await hre.ethers.getContractFactory("AuctionNFT") 
        let contractInstance = await factory.deploy() 
        auction  = await contractInstance.deployed()   

  })  


  
  

  it("Should mint a token and list", async function () {   

        let addr = await ethers.getSigners();  
        
        await mockNFT.connect(addr[1]).buy(1 , { from: accounts[1] } )  

        let bal = await mockNFT.balanceOf(addr1) 
        expect(parseInt(res)).to.equal(1)  


         
        
  });   

  


});
