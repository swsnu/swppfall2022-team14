import { useNavigate } from "react-router"

const Item = () => {

    const navigate = useNavigate()

    const onClickItem = () => {
        navigate('/')
    }

    return <div style={{
        border: "1px solid black", width: "197px", height: "200px",
        marginLeft: "15px", marginRight: "15px", marginTop: "30px"
    }} onClick={onClickItem}>
        <img src="https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg" style={{
            width: "100px", height: "100px"
        }} />
        <text>name</text>
        <text>#tag #tag</text>
        <text>별점</text>
    </div>
}


export default Item