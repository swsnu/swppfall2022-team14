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
                    <p className="content__description">This is a description. This is a description. This is a description. This is a description. This is a description. This is a description. This is a description. </p>
                    <p className="content__recipe">This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. </p>
                </div>
            </div>
        </div>
    )
}