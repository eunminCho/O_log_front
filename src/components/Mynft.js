import React,{useState} from 'react'
import Nftcard from './Nftcard'
import './Mynft.css'


export default function Mynft({nfts, getMyNfts, getMyOLG}) {
  const [nftArea, setNftArea] = useState(nfts.slice(0,2))
  const handleShow = () => {
    setNftArea(nftArea.concat(nfts.slice(nftArea.length, nftArea.length+2)))
  }
  return (
    <div className='mynfts'>
      <div className='mynfts_container'>
        {nftArea.map((el, idx) => {
          return <Nftcard key={idx} name={el.name} description={el.description} image={el.image} NFTrewardFactor={el.NFTrewardFactor} tokenId={el.tokenId} tokenURI={el.tokenURI} attributes={el.attributes} getMyNfts={getMyNfts} getMyOLG={getMyOLG} />
        })}
      </div>
      {nftArea.length === nfts.length ? '':<div className='nftmore' onClick={handleShow}>more</div>}
    </div>
  )
}
