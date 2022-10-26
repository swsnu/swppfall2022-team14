import { useParams } from "react-router"
import './ItemDetailPage.scss';

export default function ItemDetailPage() {
    const { type, id } = useParams();

    return (
        <div className="item-detail">
            <div className="title">
                <p className="name">Kahlua Milk</p>
                <p className="rate">4.7 / 5.0</p>
                <p className="rate-button">rate button</p>
            </div>
            <div className="content">
                <img 
                    className="image"
                    src="https://izzycooking.com/wp-content/uploads/2021/05/White-Russian-683x1024.jpg"
                />
                <p className="price">$8</p>
                <div className="description">
                    <p className="abv">20% ABV</p>
                    <p className="description">This is a description. This is a description. This is a description. This is a description. This is a description. This is a description. This is a description. </p>
                    <p className="recipe">This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. This is a recipe. </p>
                </div>
            </div>
            <div className="comments">

            </div>
        </div>
    )
}