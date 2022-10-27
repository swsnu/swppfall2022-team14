import './CreateCustomPage.scss';

export default function CreateCustomPage() {
    return (
        <div className="item-detail">
            <div className="title">
                <div className="title__name">
                    Name:
                    <input className='title__name-input' />
                </div>
                <button className="title__confirm-button">Confirm</button>
            </div>
            <div className="content">
                <img 
                    className="content__image"
                    src="https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg"
                />
                <div className="content__description-box">
                    <p className="content__abv">Expected 20% ABV</p>
                    <div className='content__description'>
                        Description:<br/>
                        <textarea className='content__description-input' />
                    </div>
                    <div className='content__recipe'>
                        Recipte:<br/>
                        <textarea className='content__recipe-input' />
                    </div>
                </div>
                <p className="content__price">Expected $8</p>
            </div>
        </div>
    )
}