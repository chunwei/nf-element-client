import { Select } from 'antd';
import { useChain } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import { getCollectionsByChain } from '../utils/collections';

function SearchCollections() {
  const { Option } = Select;
  const { chainId } = useChain();
  const NFTCollections = getCollectionsByChain(chainId);
  const navigate = useNavigate();

  function onChange(value) {
    navigate(`collection/${value}`);
  }

  return (
    <>
      <Select
        showSearch
        allowClear
        style={{ width: 200 }}
        placeholder="Find a Collection"
        optionFilterProp="children"
        onChange={onChange}
      >
        {NFTCollections &&
          NFTCollections.map((collection, i) => (
            <Option value={collection.address} key={i}>
              {collection.name}
            </Option>
          ))}
      </Select>
    </>
  );
}
export default SearchCollections;
