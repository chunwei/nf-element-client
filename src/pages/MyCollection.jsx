import { useParams } from 'react-router-dom';
import NFTBalance from '../components/NFTBalance';
const MyCollection = () => {
  const { id } = useParams();
  return (
    <>
      <NFTBalance inputValue={id} />
    </>
  );
};

export default MyCollection;
