import './Item.scss'
import React from 'react';
import { useNavigate, useParams } from "react-router";
import { CocktailItemType } from "../../store/slices/cocktail/cocktail";


const Item = (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => {

    const navigate = useNavigate()
    const params = useParams()

    const onClickItem = () => {
        navigate(`/${params.type}/${prop.id}`)
    }

    return (
        <div className="list-item" onClick={onClickItem}>
            <div className="list-item-img-wrap">
                <img className="list-item-img" src={prop.image} />
            </div>
            <div className="list-item-main">
                <div className="list-item-name">{prop.name}</div>
            </div>
            <div className="list-item-sub">
                <div>{prop.tags.map(tag => { return `#${tag} ` })}</div>
                <div className="list-item-rate">{prop.rate} / 5점</div>
            </div>

        </div>
    )
}

export default Item