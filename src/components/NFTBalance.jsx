import React, { useState } from 'react';
import {
  useMoralis,
  useNFTBalances,
  useWeb3ExecuteFunction,
} from 'react-moralis';
import {
  Card,
  Image,
  Tooltip,
  Modal,
  Input,
  Skeleton,
  notification,
} from 'antd';
import { getExplorer } from '../utils/networks';
import { useVerifyMetadata } from '../hooks/useVerifyMetadata';
import AddressInput from './AddressInput';
import {
  FileSearchOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

import { marketAddress } from '../utils/ContractsAddress';
import NFTMarket from '../contracts/NFTMarket.json';

const { Meta } = Card;

const styles = {
  NFTs: {
    display: 'flex',
    flexWrap: 'wrap',
    WebkitBoxPack: 'start',
    justifyContent: 'flex-start',
    margin: '0 auto',
    maxWidth: '1000px',
    width: '100%',
    gap: '10px',
  },
  text: {
    //color: '#041836',
    // display: 'flex',
    // justifyContent: 'space-between',
    fontSize: '27px',
    fontWeight: 'bold',
    margin: '0 auto',
    maxWidth: '1000px',
    marginBottom: '40px',
  },
};

function NFTBalance() {
  const { Moralis, chainId } = useMoralis();
  const { data: NFTBalances } = useNFTBalances();
  const [visible, setVisibility] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  sellModalVisible;
  const [receiverToSend, setReceiver] = useState(null);
  const [amountToSend, setAmount] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(null);
  const [nftToSell, setNftToSell] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { verifyMetadata } = useVerifyMetadata();

  const contractProcessor = useWeb3ExecuteFunction();
  const marketContractAbi = NFTMarket.abi;
  const sellItemFunction = 'createMarketItem';

  async function sell(nft, price) {
    console.log('sell ', nft, price);
    const p = price * ('1e' + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: sellItemFunction,
      abi: marketContractAbi,
      params: {
        nftContract: nft.token_address,
        tokenId: nft.token_id,
        price: String(p),
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        notification.success({
          message: 'Success',
          description: 'NFT is listed on Marketplace.',
        });
      },
      onError: (err) => {
        notification.error({
          message: 'Error',
          description: JSON.stringify(err),
        });
      },
    });

    setSellModalVisible(false);
  }
  async function transfer(nft, amount, receiver) {
    console.log(nft, amount, receiver);
    const options = {
      type: nft?.contract_type?.toLowerCase(),
      tokenId: nft?.token_id,
      receiver,
      contractAddress: nft?.token_address,
    };

    if (options.type === 'erc1155') {
      options.amount = amount ?? nft.amount;
    }

    setIsPending(true);

    try {
      const tx = await Moralis.transfer(options);
      console.log(tx);
      setIsPending(false);
    } catch (e) {
      alert(e.message);
      setIsPending(false);
    }

    setVisibility(false);
  }

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };
  const handleSellClick = (nft) => {
    setNftToSell(nft);
    setSellModalVisible(true);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  console.log('NFTBalances', NFTBalances);
  return (
    <div /* style={{ padding: '15px', maxWidth: '1030px', width: '100%' }} */>
      <div style={styles.text}>
        <h1>My NFT Balances</h1>
      </div>
      <div style={styles.NFTs}>
        <Skeleton loading={!NFTBalances?.result}>
          {NFTBalances?.result &&
            NFTBalances.result.map((nft, index) => {
              //Verify Metadata
              nft = verifyMetadata(nft);
              return (
                <Card
                  hoverable
                  actions={[
                    <Tooltip title="View On Blockexplorer">
                      <FileSearchOutlined
                        onClick={() =>
                          window.open(
                            `${getExplorer(chainId)}address/${
                              nft.token_address
                            }`,
                            '_blank'
                          )
                        }
                      />
                    </Tooltip>,
                    <Tooltip title="Transfer NFT">
                      <SendOutlined onClick={() => handleTransferClick(nft)} />
                    </Tooltip>,
                    <Tooltip title="Sell On Marketplace">
                      <ShoppingCartOutlined
                        onClick={() => handleSellClick(nft)}
                      />
                    </Tooltip>,
                  ]}
                  style={{ width: 240 }}
                  cover={
                    <Image
                      preview={false}
                      src={nft?.image || 'error'}
                      fallback="data:image/png;base64,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"
                      alt=""
                      style={{
                        height: '240px',
                        filter: nft?.image ? '' : 'invert(90%)',
                      }}
                    />
                  }
                  key={index}
                >
                  <Meta title={nft.name} description={'#' + nft.token_id} />
                </Card>
              );
            })}
        </Skeleton>
      </div>
      <Modal
        title={`Transfer ${nftToSend?.name || 'NFT'}`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={() => transfer(nftToSend, amountToSend, receiverToSend)}
        confirmLoading={isPending}
        okText="Send"
      >
        <AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
        {nftToSend && nftToSend.contract_type === 'erc1155' && (
          <Input
            placeholder="amount to send"
            onChange={(e) => handleChange(e)}
          />
        )}
      </Modal>
      <Modal
        title={`Sell ${nftToSell?.name || 'NFT'} on Market`}
        visible={sellModalVisible}
        onCancel={() => setSellModalVisible(false)}
        onOk={() => sell(nftToSell, price)}
        confirmLoading={isPending}
        okText="Sell"
      >
        <Input
          placeholder="Set Price"
          onChange={(e) => setPrice(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default NFTBalance;
