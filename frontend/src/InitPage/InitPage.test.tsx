import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import InitPage, { Filterparam } from "./InitPage";
import { Iprops as FilterProp } from "./Components/Filter";
import { prop as LoginModalProp } from "./Modals/LoginModal";
import { prop as RecommendModalProp } from "./Modals/RecommendModal";
import { prop as InitMyLiquorModalProp } from "./Modals/InitMyLiquorModal";
import { UserInfo } from "../store/slices/user/user";
import React from 'react'
import { RateInfo } from "../store/slices/rate/rate";



// eslint-disable-next-line react/display-name
jest.mock("../common/Components/Item", () => (prop: Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => (
    <div data-testid="spyCocktail">
        <img className="item__image" src={prop.image} />
        <div className="item__name">{prop.name}</div>
        <div className="item__rate">{prop.rate} / 5점</div>
        <div className="item__tags">
            {prop.tags.map(tag => { return <div className="item__tag" key={tag}>#{tag} </div> })}
        </div>
    </div>
));

// eslint-disable-next-line react/display-name
jest.mock("./Components/Filter", () => (prop: FilterProp) => {
    const mockFilterParam: Filterparam = { type_one: [], type_two: [], type_three: [], available_only: false }
    return (
        <div data-testid="spyFilter">
            <div className="filter__title">Type 1</div>
            <div className="filter__content">
                <button onClick={() => prop.setUrlParams(mockFilterParam)}>
                    클래식
                </button>
            </div>
        </div>
    )
});

// eslint-disable-next-line react/display-name
jest.mock("./Modals/LoginModal", () => (prop: LoginModalProp) => (
    <div data-testid="spyLoginModal">
        <button onClick={() => { prop.setIsOpen(false); }}>Login</button>
    </div>
));

// eslint-disable-next-line react/display-name
jest.mock("./Modals/RecommendModal", () => (prop: RecommendModalProp) => (
    <div data-testid="spyRecommendModal">
        <button onClick={() => { prop.setIsOpen(false); }}>Recommend</button>
    </div>
));


// eslint-disable-next-line react/display-name
jest.mock("./Modals/InitMyLiquorModal", () => (prop: InitMyLiquorModalProp) => (
    <div data-testid="spyInitMyLiquorModal" />
));




const cocktailList: CocktailItemType[] = [
    {
        id: 1,
        name: "COCKTAIL_NAME_1",
        image: "COCKTAIL_IMAGE_1",
        type: "ST",
        tags: ["TAG_1", "TAG_2"],
        author_id: null,
        rate: 5,
        is_bookmarked: false
    },
    {
        id: 2,
        name: "COCKTAIL_NAME_2",
        image: "COCKTAIL_IMAGE_2",
        type: "ST",
        tags: ["TAG_1"],
        author_id: null,
        rate: 4,
        is_bookmarked: false
    },
    {
        id: 3,
        name: "COCKTAIL_NAME_3",
        image: "COCKTAIL_IMAGE_3",
        type: "CS",
        tags: ["TAG_2"],
        author_id: 1,
        rate: 3,
        is_bookmarked: false
    },
];

const stubCommentInitialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
};

const stubIngredientInitialState: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
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
    isLogin: (localStorage.getItem("token") !== null)
}

const loggedInUserState: UserInfo = {
    user: {
        id: "1",
        username: "1",
        password: "1",
        nickname: "1",
        intro: "1",
        profile_img: "1"
    },
    token: "1",
    isLogin: true
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


const renderInitPage = (isStandard = true, user: UserInfo) => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<InitPage />} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: {
                    cocktailList:
                        isStandard ?
                            cocktailList.filter((cocktail) => cocktail.type === "ST") :
                            cocktailList.filter((cocktail) => cocktail.type === "CS"),
                    cocktailItem: null,
                    itemStatus: "loading",
                    listStatus: "loading",
                },
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
                user: user,
                rate: rateState
            },
        }
    );
};

describe("<InitPage />", () => {
    it("should render InitPage", async () => {
        renderInitPage(true, stubUserInitialState);
        await screen.findByText("COCKTAIL_NAME_1");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(2);
    });
    it("should render standard cocktails when standard button clicked", async () => {
        renderInitPage(true, stubUserInitialState);
        const customButton = screen.getByText("커스텀");
        fireEvent.click(customButton);
        const standardButton = screen.getByText("스탠다드");
        fireEvent.click(standardButton);
        await screen.findByText("COCKTAIL_NAME_1");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(2);
    });
    it("should render custom cocktails when custom button clicked", async () => {
        renderInitPage(false, stubUserInitialState);
        const customButton = screen.getByText("커스텀");
        fireEvent.click(customButton);
        await screen.findByText("COCKTAIL_NAME_3");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(1);
    });
    it("should render filter when filter button clicked", async () => {
        renderInitPage(true, stubUserInitialState);
        const filterButton = screen.getByText("FILTER");
        fireEvent.click(filterButton);
        await screen.findByText("Type 1");
    });
    it("should render search bar when search bar inputed", async () => {
        renderInitPage(true, stubUserInitialState);
        const searchBar = screen.getByPlaceholderText("칵테일 이름 검색");
        fireEvent.change(searchBar, { target: { value: "COCKTAIL" } });
        expect(searchBar).toHaveDisplayValue("COCKTAIL");
    });
    it("should navigate to /standard with params when search button clicked (standard)", async () => {
        renderInitPage(true, stubUserInitialState);
        const filterButton = screen.getByText("FILTER");
        fireEvent.click(filterButton);
        await screen.findByText("Type 1");
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("SEARCH")
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/standard", { "state": { "filter_param": { "available_only": false, "type_one": [], "type_three": [], "type_two": [] }, "name_param": "" } }));
    });


    it("should navigate to /custom with params when search button clicked (custom)", async () => {
        renderInitPage(false, stubUserInitialState);
        const customButton = screen.getByText("커스텀");
        fireEvent.click(customButton);
        await screen.findByText("COCKTAIL_NAME_3");
        const filterButton = screen.getByText("FILTER");
        fireEvent.click(filterButton);
        await screen.findByText("Type 1");
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("SEARCH")
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/custom", { "state": { "filter_param": { "available_only": false, "type_one": [], "type_three": [], "type_two": [] }, "name_param": "" } }));
    });
    it("should render login modal when login button clicked", async () => {
        renderInitPage(true, stubUserInitialState);
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
    });
    it("should render profile when profile button clicked", async () => {
        renderInitPage(true, stubUserInitialState);
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
        renderInitPage(true, loggedInUserState)
        await screen.findByText("내 프로필");
        const profileButton = screen.getByText("내 프로필");
        fireEvent.click(profileButton);
        await screen.findByText("My Page");
    });
    it("should naviate to /mypage when my page button clicked", async () => {
        renderInitPage(true, stubUserInitialState);
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
        renderInitPage(true, loggedInUserState)
        await screen.findByText("내 프로필");
        const profileButton = screen.getByText("내 프로필");
        fireEvent.click(profileButton);
        await screen.findByText("Get Info");
        const getInfoButton = screen.getByText("Get Info")
        fireEvent.click(getInfoButton)
        await screen.findByText("My Page");
        const myPageButton = screen.getByText("My Page");
        fireEvent.click(myPageButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/mypage"));


    });
    it("should logout when logout button clicked", async () => {
        renderInitPage(true, stubUserInitialState);
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
        renderInitPage(true, loggedInUserState)
        await screen.findByText("내 프로필");
        const profileButton = screen.getByText("내 프로필");
        fireEvent.click(profileButton);
        await screen.findByText("My Page");
        const logoutButton = screen.getByText("Logout");
        fireEvent.click(logoutButton);
        await screen.findByText("로그인");
    });
    it("should render my liquor modal when my liquor button clicked", async () => {
        renderInitPage(true, stubUserInitialState);
        const myLiquorModalButton = screen.getByText("My Liquor");
        fireEvent.click(myLiquorModalButton);
        await screen.findByTestId("spyInitMyLiquorModal");
    });
    it("should handle ingredient recommendtation", async () => {
        renderInitPage(true, loggedInUserState);
        const recommendButton = screen.getByText("재료추천받기");
        fireEvent.click(recommendButton);
        await screen.findByTestId("spyRecommendModal");
    });
    it("should handle ingredient recommendtation when not logged in", async () => {
        renderInitPage(true, stubUserInitialState);
        const recommendButton = screen.getByText("재료추천받기");
        fireEvent.click(recommendButton);
        await screen.findByTestId("spyLoginModal");
    });
});