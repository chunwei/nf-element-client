import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMoralisFile } from 'react-moralis';
import './FileUploader.css';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function FileUploader({ value = [], onChange }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [fileList, setFileList] = useState([]);

  const { saveFile, isUploading } = useMoralisFile();

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  const handleUpload = async (info) => {
    console.log('handleUpload: ', info);
    const { filename, file, onProgress, onError, onSuccess } = info;
    const ipfsFile = await saveFile(filename, file, { saveIPFS: true });
    console.log(ipfsFile);
    setImageUrl(ipfsFile._ipfs);
    onChange?.([ipfsFile]);
  };
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const UploadButton = ({ loading }) => (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      fileList={value}
      name="media"
      listType="picture-card"
      className="meida-uploader"
      showUploadList={false}
      //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      customRequest={handleUpload}
      beforeUpload={beforeUpload}
      //onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="media" style={{ width: '100%' }} />
      ) : (
        <UploadButton loading={isUploading} />
      )}
    </Upload>
  );
}

export default FileUploader;
