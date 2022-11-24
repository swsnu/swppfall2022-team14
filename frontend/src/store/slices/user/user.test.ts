import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import { Filterparam } from "../../../InitPage/InitPage";
import reducer, {
    UserInfo,
    UserType
} from "./user";
import {registerUser, loginUser, logoutUser, getUser} from "./user"
import {
    authPostCocktail,
    CocktailInfo, editCocktail,
    fetchCustomCocktailList, fetchMyBookmarkCocktailList, fetchMyCocktailList,
    fetchStandardCocktailList,
    FilterParamType, getCocktail, postCocktail,
    PostForm, toggleBookmark
} from "../cocktail/cocktail";

describe("user reducer", () => {

});