import { MemoryRouter, Route, Routes } from "react-router";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/mock";
import { CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import InitPage from "./InitPage";
import { Iprops as FilterProp } from "./Components/Filter";
import { prop as LoginModalProp } from "./Modals/LoginModal";
import { prop as InitMyLiquorModalProp } from "./Modals/InitMyLiquorModal";

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

jest.mock("./Components/Filter", () => (prop: FilterProp) => {
    return (
        <div data-testid="spyFilter">
            <div className="filter__title">Type 1</div>
            <div className="filter__content">
                <button onClick={() => prop.setUrlParams("?filter_type_one=_CL")}>
                    클래식
                </button>
            </div>
        </div>
    )
});

jest.mock("./Modals/LoginModal", () => (prop: LoginModalProp) => (
    <div data-testid="spyLoginModal">
        <button onClick={() => { prop.setLoginState(true); prop.setIsOpen(false); }}>Login</button>
    </div>
));

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
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};

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

const renderInitPage = (isStandard: Boolean=true) => {
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
            },
        }
    );
};

describe("<InitPage />", () => {
    it("should render InitPage", async () => {
        renderInitPage();
        await screen.findByText("COCKTAIL_NAME_1");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(2);
    });
    it("should render standard cocktails when standard button clicked", async () => {
        renderInitPage();
        const customButton = screen.getByText("커스텀");
        fireEvent.click(customButton);
        const standardButton = screen.getByText("스탠다드");
        fireEvent.click(standardButton);
        await screen.findByText("COCKTAIL_NAME_1");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(2);
    });
    it("should render custom cocktails when custom button clicked", async () => {
        renderInitPage(false);
        const customButton = screen.getByText("커스텀");
        fireEvent.click(customButton);
        await screen.findByText("COCKTAIL_NAME_3");
        const cocktails = screen.getAllByTestId("spyCocktail");
        expect(cocktails).toHaveLength(1);
    });
    it("should render filter when filter button clicked", async () => {
        renderInitPage();
        const filterButton = screen.getByText("FILTER");
        fireEvent.click(filterButton);
        await screen.findByText("Type 1");
    });
    it("should render search bar when search bar inputed", async () => {
        renderInitPage();
        const searchBar = screen.getByPlaceholderText("칵테일 이름 검색");
        fireEvent.change(searchBar, { target: { value: "COCKTAIL" } });
        expect(searchBar).toHaveDisplayValue("COCKTAIL");
    });
    it("should navigate to /standard with params when search button clicked (standard)", async () => {
        renderInitPage();
        const filterButton = screen.getByText("FILTER");
        fireEvent.click(filterButton);
        await screen.findByText("Type 1");
        const typeButton = screen.getByText("클래식")
        fireEvent.click(typeButton);
        const searchButton = screen.getByText("SEARCH")
        fireEvent.click(searchButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith({
            pathname: "/standard",
            search: "?filter_type_one=_CL&text=",
        }));
    });
    it("should navigate to /custom with params when search button clicked (custom)", async () => {
        renderInitPage(false);
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
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith({
            pathname: "/custom",
            search: "?filter_type_one=_CL&text=",
        }));
    });
    it("should render login modal when login button clicked", async () => {
        renderInitPage();
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
    });
    it("should render profile when profile button clicked", async () => {
        renderInitPage();
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
        await screen.findByText("내 프로필");
        const profileButton = screen.getByText("내 프로필");
        fireEvent.click(profileButton);
        await screen.findByText("My Page");
    });
    it("should naviate to /mypage when my page button clicked", async () => {
        renderInitPage();
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
        await screen.findByText("내 프로필");
        const profileButton = screen.getByText("내 프로필");
        fireEvent.click(profileButton);
        await screen.findByText("My Page");
        const myPageButton = screen.getByText("My Page");
        fireEvent.click(myPageButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/mypage"));
    });
    it("should logout when logout button clicked", async () => {
        renderInitPage();
        const loginModalButton = screen.getByText("로그인");
        fireEvent.click(loginModalButton);
        await screen.findByTestId("spyLoginModal");
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
        await screen.findByText("내 프로필");
        const profileButton = screen.getByText("내 프로필");
        fireEvent.click(profileButton);
        await screen.findByText("My Page");
        const logoutButton = screen.getByText("Logout");
        fireEvent.click(logoutButton);
        await screen.findByText("로그인");
    });
    it("should render my liquor modal when my liquor button clicked", async () => {
        renderInitPage();
        const myLiquorModalButton = screen.getByText("My Liquor");
        fireEvent.click(myLiquorModalButton);
        await screen.findByTestId("spyInitMyLiquorModal");
    });
});