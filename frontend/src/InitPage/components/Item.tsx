import { useNavigate } from "react-router"
import './Item.scss'
export interface CocktailType {
    id: number,
    name: string,
    image: string,
    introduction: string,
    recipe: string,
    ABV: number,
    price_per_glass: number
    type: string,
    author_id: number,
    created_at: Date,
    updated_at: Date,
    rate: number
}
const Item = (prop: Pick<CocktailType, "image" | "name" | "rate" | "type" | "id">) => {

    const navigate = useNavigate()


    const onClickItem = () => {
        if (prop.type === 'CS') navigate(`/custom/${prop.id}`)
        else if (prop.type === 'ST') navigate(`/standard/${prop.id}`)
    }

    return <div className="item" onClick={onClickItem}>
        <img className="item__image" src={prop.image} />
        <div className="item__name">{prop.name}</div>
        <div className="item__rate">{prop.rate} / 5점</div>

    </div>
}


export default Item