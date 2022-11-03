import {useEffect} from "react";
import {fetchIngredientList, getIngredient} from "../store/slices/ingredient/ingredient";
import {useDispatch, useSelector} from "react-redux";
import {selectCocktail} from "../store/slices/cocktail/cocktail";
import {AppDispatch} from "../store";

const Dum = () => {

    const dispatch = useDispatch<AppDispatch>()

    const test = () => {
        console.log("fdas")
        dispatch(fetchIngredientList())
        dispatch(getIngredient(1))
        console.log("asdf")
    }

    return(
        <div>
            <button onClick={test}>test</button>
        </div>
    )
}


export default Dum