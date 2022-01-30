import { useParams } from 'react-router-dom';
import NFTTokenIds from '../components/NFTTokenIds';
const NFTCollection = () => {
  const { id } = useParams();
  return (
    <>
      <NFTTokenIds inputValue={id} />
    </>
  );
};

export default NFTCollection;
