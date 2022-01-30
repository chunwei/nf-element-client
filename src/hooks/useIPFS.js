export const useIPFS = () => {
  const resolveLink = (url) => {
    if (!url || !url.includes('ipfs://')) return url;
    if (url.includes('ipfs://ipfs/'))
      return url.replace('ipfs://ipfs/', 'https://gateway.ipfs.io/ipfs/');
    return url.replace('ipfs://', 'https://gateway.ipfs.io/ipfs/');
  };

  return { resolveLink };
};
