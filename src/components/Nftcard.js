import React, {useState} from 'react'
import './Nftcard.css'
import Modal from '../components/Modal';

export default function Nftcard(props) {
  const {name, description, image, NFTrewardFactor, tokenURI, tokenId, attributes, getNfts, getMyNfts, getMyOLG} = props

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  //가격은 레벨에 따라 고정값이라 서버에서 받아오지 않음(보내주긴 하는데 의미없는 것 같아요)
  const getPrice = () => {
    if(!NFTrewardFactor) return '100'
    if(NFTrewardFactor === 1) return '100'
    else if(NFTrewardFactor === 2) return '100'
    else if(NFTrewardFactor === 3) return '1000'
  }

  return (
    <div>
        <button className='nftcard_button' onClick={openModal} >
          <div className='nftcard'>
          <img className='nftcard_image' src={image} />
          <div className='nftcard_content'>
            <span className='name'>{name}</span>
            {NFTrewardFactor? <span className='reward'>Level {NFTrewardFactor}</span> : <span className='reward'>Level 1</span>}
            <span className='price'>{getPrice()} OLG</span>
          </div>
        </div>
      </button>
      <Modal open={modalOpen} close={closeModal} header={name} 
      name={name} description={description} image={image} NFTrewardFactor={NFTrewardFactor} 
      price={getPrice()} tokenURI={tokenURI} tokenId={tokenId} attributes={attributes}
      getNfts={getNfts} closeModal={closeModal} getMyNfts={getMyNfts} getMyOLG={getMyOLG}>
      </Modal>
    </div>

  )
}

