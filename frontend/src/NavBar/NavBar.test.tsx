import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo, IngredientType } from "../store/slices/ingredient/ingredient";
import NavBar from "./NavBar";
import { Iprops as NavFilterProp } from "./NavFilter/NavFilter";
import { UserInfo } from "../store/slices/user/user";
import React from 'react'
import NavFilter from "./NavFilter/NavFilter"
import { RateInfo } from "../store/slices/rate/rate";

// eslint-disable-next-line react/display-name
// jest.mock("./NavFilter/NavFilter", () => (prop: NavFilterProp) => {
//     if (prop.type === "IG") {
//         return (
//             <div data-testid="spyNavFilter">
//                 <button className="navfilter__btn" >검색하기</button>
//             </div >
//         )
//     } else {
//         return (
//             <div data-testid="spyNavFilter">
//                 <div className="navfilter_wrap">
//                     <div className="navfilter__title">Type 1</div>
//                     <div className="navfilter__content">
//                         <button>
//                             클래식
//                         </button>
//                     </div>
//                 </div>
//                 <button className="navfilter__btn">검색하기</button>
//             </div>
//         )
//     }
// });

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading",
}

const stubCommentInitialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
};


const ingredient: IngredientType = {
    id: 2,
    name: "INGREDIENT2",
    image: "IMAGE2",
    ABV: 0,
    price: 0,
    introduction: "INTRODUCTION1",
    unit: ["ml", "oz"],
    color: ""
}

const stubIngredientInitialState: IngredientInfo = {
    ingredientList: [ingredient],
    myIngredientList: [ingredient],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
    recommendIngredientList: [],
    availableCocktails: []
};

const stubUserInitialState: UserInfo = {
    user: {
        id: (localStorage.getItem("id") === null) ? null : localStorage.getItem("id"),
        username: (localStorage.getItem("username") === null) ? null : localStorage.getItem("username"),
        password: null,
        nickname: (localStorage.getItem("nickname") === null) ? null : localStorage.getItem("nickname"),
        intro: (localStorage.getItem("intro") === null) ? null : localStorage.getItem("intro"),
        profile_img: (localStorage.getItem("profile_img") === null) ? null : localStorage.getItem("profile_img"),
    },
    token: (localStorage.getItem("token") === null) ? null : localStorage.getItem("token"),
    isLogin: true
}
const stubUserInitialStateNotLogin: UserInfo = {
    user: {
        id: (localStorage.getItem("id") === null) ? null : localStorage.getItem("id"),
        username: (localStorage.getItem("username") === null) ? null : localStorage.getItem("username"),
        password: null,
        nickname: (localStorage.getItem("nickname") === null) ? null : localStorage.getItem("nickname"),
        intro: (localStorage.getItem("intro") === null) ? null : localStorage.getItem("intro"),
        profile_img: (localStorage.getItem("profile_img") === null) ? null : localStorage.getItem("profile_img"),
    },
    token: (localStorage.getItem("token") === null) ? null : localStorage.getItem("token"),
    isLogin: false
}

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderNavBar = (user: UserInfo) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<NavBar />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
                user: user,
                rate: rateState
            },
        }
    );
};

describe("<NavBar />", () => {
    it("should render NavBar", async () => {
        renderNavBar(stubUserInitialState);
        await screen.findByText("Standard");
    });
    it("should navigate to /standard with params when search button clickend (standard)", () => {
        renderNavBar(stubUserInitialState);
        // render(<NavFilter type={"ST"} />)
        const standardButton = screen.getByText("Standard");
        console.log(standardButton)
        fireEvent.click(standardButton);
        fireEvent.click(standardButton);
        fireEvent.click(standardButton);
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("검색하기")
        console.log(searchButton)
        fireEvent.click(searchButton);
        expect(mockNavigate).toHaveBeenCalledWith("/standard",
            { "state": { "filter_param": { "available_only": false, "type_one": ["CL"], "type_three": [], "type_two": [] }, "name_param": "" } });
    });
    it("should navigate to /custom with params when search button clickend (custom)", () => {
        renderNavBar(stubUserInitialState);
        // render(<NavFilter type={"CS"} />)
        const customButton = screen.getByText("Custom");
        fireEvent.click(customButton);
        fireEvent.click(customButton);
        fireEvent.click(customButton);
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("검색하기")
        fireEvent.click(searchButton);
        expect(mockNavigate).toHaveBeenCalledWith("/custom",
            { "state": { "filter_param": { "available_only": false, "type_one": ["CL"], "type_three": [], "type_two": [] }, "name_param": "" } });
    });
    it("should navigate to /ingredient with params when search button clickend (ingredient)", () => {
        renderNavBar(stubUserInitialState);
        // render(<NavFilter type={"IG"} />)
        const ingredientButton = screen.getByText("Ingredient");
        fireEvent.click(ingredientButton);
        fireEvent.click(ingredientButton);
        fireEvent.click(ingredientButton);
        const searchButton = screen.getByText("검색하기")
        fireEvent.click(searchButton);
        expect(mockNavigate).toHaveBeenCalledWith("/ingredient");
    });
    it("should naviate to /custom/create when upload button clicked", async () => {
        renderNavBar(stubUserInitialState);
        const uploadButton = screen.getByText("Upload");
        fireEvent.click(uploadButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/custom/create"));
    });
    it("should render ingredients when my liquor button clicked", async () => {
        renderNavBar(stubUserInitialState);
        const myLiquorButton = screen.getByText("My Liquor");
        fireEvent.click(myLiquorButton);
        const addButton = await screen.findByText("ADD");
        fireEvent.click(addButton)
    });
    it("should naviate to / when home button clicked", async () => {
        renderNavBar(stubUserInitialState);
        const homeButton = screen.getByText("Home");
        fireEvent.click(homeButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });
    it("should naviate to /mypage when my page button clicked", async () => {
        renderNavBar(stubUserInitialState);
        const myPageButton = screen.getByText("My Page");
        fireEvent.click(myPageButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/mypage"));
    });
    it("should navigate to /standard with params when search button clickend (standard)", () => {
        renderNavBar(stubUserInitialStateNotLogin);
        // render(<NavFilter type={"ST"} />)
        const standardButton = screen.getByText("Standard");
        console.log(standardButton)
        fireEvent.click(standardButton);
        fireEvent.click(standardButton);
        fireEvent.click(standardButton);
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("검색하기")
        console.log(searchButton)
        fireEvent.click(searchButton);
        expect(mockNavigate).toHaveBeenCalledWith("/standard",
            { "state": { "filter_param": { "available_only": false, "type_one": ["CL"], "type_three": [], "type_two": [] }, "name_param": "" } });
    });
    it("should prevent from not logged in user actions", () => {
        renderNavBar(stubUserInitialStateNotLogin);
        const uploadButton = screen.getByText("Upload");
        fireEvent.click(uploadButton);
        const myLiquorButton = screen.getByText("My Liquor");
        fireEvent.click(myLiquorButton);
        const myPageButton = screen.getByText("My Page");
        fireEvent.click(myPageButton);
        expect(mockNavigate).not.toHaveBeenCalled()
    });
});