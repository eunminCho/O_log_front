import Card from './Card'
import './MyPosts.css'

export default function MyPosts({myPosts}) {
  return (
    <div className='mypost_container'>
      {myPosts.map((el, idx) => {
        return <Card key={idx} postImageUrl={el.postImageUrl} blogLink={el.blogLink} title={el.title} created_at={el.created_at} username={el.username} faviconUrl={el.faviconUrl}/>
      })}
    </div>
  )
}
