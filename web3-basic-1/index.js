const Web3 = require('web3');
const ERC20_ABI = require('./ERC20.json');
const PROVIDER = 'https://rinkeby.infura.io/v3/710b741fe9924cc8a5fa4fa20a89e620';

// Dùng khi cần listen
const WSS_PROVIDER = 'wss://rinkeby.infura.io/ws/v3/710b741fe9924cc8a5fa4fa20a89e620';
const ethereumMulticall = require('ethereum-multicall');

(async () => {
    try {
    // Khoi tao web3
    const web3 = new Web3(WSS_PROVIDER);

    // Lấy ETH balance
    const balance = await web3.eth.getBalance('0x4EA8D1A5047257A59173583eaC50233ac397f384');
    
    // Khởi tạo contract
    const wethContract = new web3.eth.Contract(ERC20_ABI, '0xc778417e063141139fce010982780140aa0cd5ab');

    // Gọi read function 
    const balanceOfAccount = await wethContract.methods.balanceOf('0x4EA8D1A5047257A59173583eaC50233ac397f384').call();
    console.log(web3.utils.fromWei(balanceOfAccount));

    console.log(web3.utils.fromWei(balanceOfAcc));

    // Thêm private key để tự ký
    web3.eth.accounts.wallet.add('');

    // Estimase gas
    const estimaseGas = await wethContract.methods.withdraw('100000').estimateGas({ from: '0x4EA8D1A5047257A59173583eaC50233ac397f384' });

    // Gọi hàm write
    const resultTransaction = await wethContract.methods.withdraw('100000').send( { from: '0x4EA8D1A5047257A59173583eaC50233ac397f384', gas: estimaseGas * 2 });
    console.log(resultTransaction)

    // Gọi payable function
    const estimaseGasPay = await wethContract.methods.deposit().estimateGas({ from: '0x4EA8D1A5047257A59173583eaC50233ac397f384', value: web3.utils.toWei('0.1') });
    const resultTransPayable = await wethContract.methods.deposit().send({ from: '0x4EA8D1A5047257A59173583eaC50233ac397f384', value: web3.utils.toWei('0.1'), gas: estimaseGasPay * 2 })
    console.log(resultTransPayable)

    // Lấy block mới nhất
    const blockNumberLastest = await web3.eth.getBlockNumber();
    console.log({ blockNumberLastest });

    // Lấy event trong quá khứ
    const options = {
        fromBlock: blockNumberLastest - 1000,
    }
    const pastEvent = await wethContract.getPastEvents('Transfer', options);
    console.log('past event ', pastEvent);

    // Lấy event realtime
    wethContract.events.Transfer({

    }, function(error, event) {
        console.log(event);
    })
    

    // Sử dụng multicall call 1 lần lên blockchain
    const multicall = new ethereumMulticall.Multicall({ web3Instance: web3, tryAggregate: true });
    const addressList = ['0x4EA8D1A5047257A59173583eaC50233ac397f384', '0x73964F6F211D5a8428322EDFbDfEc72FF76D9fCd', '0xD1AC972382CD5e6F69D2050C3bc91Efc1007882a'];

    const contractCallContext = addressList.map((address, index) => {
        return {
            reference: 'user',
            contractAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
            abi: ERC20_ABI,
            calls: [{ reference: 'balance' + index, methodName: 'balanceOf', methodParameters: [address] }]
        }
    });
    console.log(contractCallContext);
    const result = await multicall.call(contractCallContext);
    console.log(result.results.user.callsReturnContext)
    } catch(e){
        console.log(e);
    }
})();