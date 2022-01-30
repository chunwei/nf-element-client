import { shortenAddress } from '../utils/shortenAddress';
import { NavLink } from 'react-router-dom';
const CollectionCard = ({ collection }) => {
  const { name, icon, address } = collection;
  return (
    <NavLink to={`/collection/${address}`}>
      <div
        className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
      >
        <div className="flex flex-col items-center w-full mt-3">
          <div className="display-flex justify-start w-full mb-6 p-2">
            <p className="text-white text-base">
              Address: {shortenAddress(address)}
            </p>
          </div>
          <img
            src={icon}
            alt="nature"
            className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
          />
          <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
            <p className="text-[#37c7da] font-bold">{name}</p>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default CollectionCard;
