import { useChain, useMoralis } from 'react-moralis';
import { getCollectionsByChain } from '../utils/collections';
import CollectionCard from './CollectionCard';
import SearchCollections from './SearchCollections';

function CollectionList() {
  //  const { chainId } = useChain();
  const { Moralis, chainId } = useMoralis();
  const NFTCollections = getCollectionsByChain(chainId);
  if (!chainId && !NFTCollections) {
    return <div>chainId or NFTCollections is null</div>;
  }
  console.log('NFTCollections length : ', NFTCollections.length);
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">
          <span style={{ marginRight: 36 }}>Explore All Collections</span>
          <SearchCollections />
        </h3>

        <div className="flex flex-wrap justify-center items-center mt-10">
          {NFTCollections &&
            NFTCollections.map((collection, i) => (
              <CollectionCard key={i} collection={collection} />
            ))}
        </div>
      </div>
    </div>
  );
}
export default CollectionList;
