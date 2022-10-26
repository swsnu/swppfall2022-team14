import { stringify } from "querystring";
import { useNavigate } from "react-router"

interface prop {
    id: number
    name: string;
    image: string;
    type: string;
}
const Item = (prop: prop) => {

    const navigate = useNavigate()

    const onClickItem = () => {
        navigate(`/${prop.type}/${prop.id}`)
    }

    return <div style={{
        border: "1px solid black", width: "197px", height: "200px",
        marginLeft: "15px", marginRight: "15px", marginTop: "30px"
    }} onClick={onClickItem}>
        <img src={prop.image} style={{
            width: "100px", height: "100px"
        }} />{prop.name}
        #tag #tag
        별점
    </div>
}


export default Item