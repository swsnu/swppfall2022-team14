import { stringify } from "querystring";
import { useNavigate } from "react-router"


const Filter = () => {


    return <div style={{ border: "1px solid black", width: "150px", height: "100px", background: "lightgray" }}>
        <div>
            Type 1
            <input type="checkbox" name="type1" />
            <input type="checkbox" name="type1" />
            <input type="checkbox" name="type1" />
        </div>
        <div>   Type 2
            <input type="checkbox" name="type2" />
            <input type="checkbox" name="type2" />
            <input type="checkbox" name="type2" />
        </div>
    </div>
}


export default Filter