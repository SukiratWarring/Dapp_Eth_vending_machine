import 'bulma/css/bulma.css'
import { useState,useEffect } from 'react'
import Web3 from 'web3'
import Head from 'next/head'
import VendingMachineContract from '../blockchain/vending'
import styles from '../styles/VendingMachine.module.css'

const VendingMachine =()=>{
    const [error,setError]=useState('')
    const[successMsg,setsuccessMsg]=useState('')
    const[inventory,setInventory]=useState('')
    const [myDonutCount,setmyDonutCount]=useState('')
    const[buycount,setbuycount]=useState('')
    const[web3,setweb3]=useState(null)
    const [address,setAddress]=useState(null)
    const [vmContract,setVmcontract]=useState(null)

    //window.ethereum
    useEffect(()=>{
        
    },[vmContract,address])

    const getInventoryHandler=async()=>{
        const inventory=await vmContract.methods.getVendingMachineBalance().call()
        setInventory(inventory)

    }
    const getmyDonutcountHandler = async()=>{
        
        const count = await vmContract.methods.donutBalances(address).call()
        setmyDonutCount(count)
    }
    const updateDonutQty= event =>{
        setbuycount(event.target.value)
    }
    const buyDonutsHandler=async()=>{
        try{
            await vmContract.methods.purchase(buycount).send({
                from: address,
                value: web3.utils.toWei('2','ether')* buycount
        })
        
        setsuccessMsg(`${buycount} donuts purchased!!`)

        if(vmContract)getInventoryHandler()
        if(vmContract && address) getmyDonutcountHandler()
        }catch(err){
            setError(err.message)
        }
        
        

    }
    const connectWalletHandler=async()=>{
        //check if MetaMask is available
        if(typeof window !== 'undefined' && typeof window.ethereum !=='undefined'){
            try{
                //request wallet instance
            window.ethereum.request({method: "eth_requestAccounts"})
            //set web3 instance
            web3=new Web3(window.ethereum)
            setweb3(web3)
            //get list of accounts
            const accounts=await web3.eth.getAccounts();//metamask api 
            setAddress(accounts[0])

            //create local contract copy
                const vm=VendingMachineContract(web3)
                setVmcontract(vm)

        }catch(err){
            setError(err.message)
        }
        }
        else{
            console.log("Install Metamask")
        }

    }
    return(
        <div className={styles.Head}>
            <Head>
            <title>Vending Machine App</title>
            <meta name="description" content="A blockchain vending App" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav className='navbar mt-4 mb-4'>
                <div className='container'>
                    <div className='navbar-brand'>
                        <h1>Vending Machine</h1>
                    </div>
                    <div className='navbar-end'>
                        <button onClick={connectWalletHandler} className='button is-primary'>Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className='container'>
                    <h2>Vending Machine Inventory:{inventory}</h2>
                </div>
            </section>
            <section>
                <div className='container'>
                    <h2>My donuts:{myDonutCount}</h2>
                </div>
            </section>
            <section className='mt-5'>
                <div className='container'>
                    <div className='field'>
                        <label className='label'>Buy Donuts</label>
                        <div className='control'>
                            <input onChange={updateDonutQty} className='input' type='type' placeholder='Enter Amount....'/>
                        </div>
                        <button 
                        onClick={buyDonutsHandler} 
                        className='button is-primary mt-2'
                        >Buy</button>
                    </div>
                </div>
            </section>  
            <section>   
                <div className='container has-text-danger'>
                    <p>{error}</p>
                </div>
            </section>
            <section>   
                <div className='container has-text-success'>
                    <p>{successMsg}</p>
                </div>
            </section>
        </div>
    
    )
}
export default VendingMachine