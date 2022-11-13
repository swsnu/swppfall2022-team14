import './Ingr.scss'
import React from 'react';
import {useNavigate, useParams} from "react-router";
import {IngredientType} from "../../store/slices/ingredient/ingredient";


const Ingr = (prop: Pick<IngredientType, "image" | "name" | "id">) => {

    const navigate = useNavigate()
    const params = useParams()

    const onClickItem = () => {
        navigate(`/${params.type}/${prop.id}`)
    }

    return(
        <div className="list-item" onClick={onClickItem}>
            <div className="list-item-img-wrap">
                <img className="list-item-img" src={prop.image} />
            </div>
            <div className="list-item-main">
                <div className="list-item-name">{prop.name}</div>
            </div>
            <div className="list-item-sub">
                <div>#test #test #test</div>
            </div>
        </div>
    )
}

export default Ingr