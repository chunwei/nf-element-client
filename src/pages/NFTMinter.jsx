import { useState } from 'react';
import {
  Form,
  Select,
  Input,
  AutoComplete,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  Modal,
} from 'antd';
import FileUploader from '../components/FileUploader';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useMoralis, useMoralisFile, useMoralisWeb3Api } from 'react-moralis';
import { nfElementAddress as address } from '../utils/ContractsAddress';
import NFElem from '../contracts/NFElement.json';
import { useNavigate } from 'react-router-dom';
const { abi: collectionAbi } = NFElem;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const NFTMinter = ({ web3 }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintingError, setMintingError] = useState(false);
  const [mintingSuccess, setMintingSuccess] = useState(false);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const navigate = useNavigate();

  const { account, chainId } = useMoralis();
  const { saveFile, isUploading } = useMoralisFile();
  const Web3API = useMoralisWeb3Api();

  const triggerWeb3Api = async (address) => {
    await Web3API.token.syncNFTContract({
      chain: chainId,
      address: address,
    });
  };

  const mint = async (to, uri, signer) => {
    setIsMinting(true);
    const contract = new web3.eth.Contract(collectionAbi, address);

    await contract.methods
      .mint(to, 11 /* new Date().getTime() */, uri) //.mintNFT(to, uri)
      .send({ from: signer })
      .on('receipt', () => {
        triggerWeb3Api(address);
        setMintingSuccess(true);
        setIsMinting(false);
        navigate('/mycollection');
      })
      .on('error', (error) => {
        console.log('mint error: ', error);
        setMintingError(error);
        setIsMinting(false);
        Modal.error({
          title: 'Error',
          content: JSON.stringify(error),
          width: '68%',
          bodyStyle: {
            maxHeight: 500,
            overflow: 'auto',
          },
        });
      });
  };

  const mintNFT = (e) => {
    let metadata = {
      name: e.name,
      symbol: e.symbol,
      description: e.description,
      url: e.mediaFile[0].ipfs(),
      image: e.mediaFile[0].ipfs(),
      external_url: e.externalLink,
      supply: e.supply,
    };
    saveFile(
      'metadata.json',
      { base64: btoa(unescape(encodeURIComponent(JSON.stringify(metadata)))) },
      {
        type: 'json',
        metadata,
        saveIPFS: true,
      }
    ).then(async (file) => {
      const hash = file['_hash'];
      await mint(account /* e.to */, `ipfs://${hash}`, account);
    });
  };

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        ['.com', '.org', '.net', '.io', '.eth'].map(
          (domain) => `${value}${domain}`
        )
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    mintNFT(values);
  };

  return (
    <div style={{ maxWidth: 1000, margin: 'auto' }}>
      <Form
        layout="vertical"
        name="nftMetadata"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          supply: 1,
          collection: 'nfElementAddress',
        }}
      >
        <Form.Item
          // valuePropName="fileList"
          // getValueFromEvent={normFile}
          name="mediaFile"
          label="Image, Video, Audio, or 3D Model"
          extra="File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 2 MB"
        >
          <FileUploader />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          placeholder="Item name"
          rules={[
            {
              required: true,
              message: 'Please input item name!',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="symbol"
          label="Symbol"
          placeholder="Item symbol"
          /* rules={[
            {
              required: true,
              message: 'Please input item symbol!',
              whitespace: true,
            },
          ]} */
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="externalLink"
          label="External link"
          extra="include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
          //rules={[{ required: true, message: 'Please input External link!' }]}
        >
          <AutoComplete
            options={websiteOptions}
            onChange={onWebsiteChange}
            placeholder="https://yoursite.io/item/123"
          >
            <Input />
          </AutoComplete>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          extra="The description will be included on the item's detail page underneath its image."
          //rules={[{ required: true, message: 'Please input description' }]}
        >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item
          name="collection"
          label="Collection"
          extra="This is the collection where your item will appear. "
          hasFeedback
          /* rules={[
            {
              required: true,
              message: 'Please select collection!',
            },
          ]} */
        >
          <Select placeholder="Please select collection">
            <Option value="nfElementAddress">NF Element</Option>
            {/* <Option value="collection2">collection 2</Option> */}
          </Select>
        </Form.Item>

        <Form.Item
          name="supply"
          label="Supply"
          extra="The number of copies that can be minted. "
          rules={[{ required: true, message: 'Please input donation amount!' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        {/* 
        <Form.Item label="InputNumber">
          <Form.Item name="input-number" noStyle>
            <InputNumber min={1} max={10} />
          </Form.Item>
          <span className="ant-form-text"> machines</span>
        </Form.Item>

        <Form.Item name="switch" label="Switch" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="slider" label="Slider">
          <Slider
            marks={{
              0: 'A',
              20: 'B',
              40: 'C',
              60: 'D',
              80: 'E',
              100: 'F',
            }}
          />
        </Form.Item>

        <Form.Item name="radio-group" label="Radio.Group">
          <Radio.Group>
            <Radio value="a">item 1</Radio>
            <Radio value="b">item 2</Radio>
            <Radio value="c">item 3</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="radio-button"
          label="Radio.Button"
          rules={[
            {
              required: true,
              message: 'Please pick an item!',
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="a">item 1</Radio.Button>
            <Radio.Button value="b">item 2</Radio.Button>
            <Radio.Button value="c">item 3</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="checkbox-group" label="Checkbox.Group">
          <Checkbox.Group>
            <Row>
              <Col span={8}>
                <Checkbox
                  value="A"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  A
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="B"
                  style={{
                    lineHeight: '32px',
                  }}
                  disabled
                >
                  B
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="C"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  C
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="D"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  D
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="E"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  E
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="F"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  F
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item name="rate" label="Rate">
          <Rate />
        </Form.Item> */}

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button disabled={isMinting} type="primary" htmlType="submit">
            {isMinting ? 'Minting' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default NFTMinter;
