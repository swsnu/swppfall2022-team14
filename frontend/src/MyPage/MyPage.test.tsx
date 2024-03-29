import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { CocktailInfo } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import { RateInfo } from "../store/slices/rate/rate";
import { UserInfo } from "../store/slices/user/user";
import { getMockStore } from "../test-utils/mock";
import MyPage from "./MyPage";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));


jest.mock("./MyIngredient", () => () => (
    <div data-testid={`spyMyIngredient`}>
    </div>
));

jest.mock("./MyBookmark", () => () => (
    <div data-testid={`spyMyBookmark`}>
    </div>
));

jest.mock("./MyCustomCocktail", () => () => (
    <div data-testid={`spyMyCustomCocktail`}>
    </div>
));

jest.mock("./MyComment", () => () => (
    <div data-testid={`spyMyComment`}>
    </div>
));

const emptyCocktaiState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const emptyCommentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}

const emptyIngredientState: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
    recommendIngredientList: [],
    availableCocktails: []
}

const loggedInState: UserInfo = {
    user: {
        id: "1",
        username: "USERNAME",
        password: null,
        nickname: null,
        intro: null,
        profile_img: null,
    },
    token: "TOKEN",
    isLogin: true
}

const loggedOutState: UserInfo = {
    user: null,
    token: null,
    isLogin: false
}

const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 },
    myRate: null
}

const mockLoggedInStore = getMockStore({ cocktail: emptyCocktaiState, ingredient: emptyIngredientState, comment: emptyCommentState, user: loggedInState, rate: rateState });
const mockLoggedOutStore = getMockStore({ cocktail: emptyCocktaiState, ingredient: emptyIngredientState, comment: emptyCommentState, user: loggedOutState, rate: rateState });

const mockAlert = jest.fn()
global.alert = mockAlert


describe("<MyPage />", () => {
    it("should render without errors", () => {
        render(<Provider store={mockLoggedInStore}><MyPage /></Provider>);
        const myIngredient = screen.getAllByTestId("spyMyIngredient");
        expect(myIngredient).toHaveLength(1);
    });

    it("should handle view change button", () => {
        render(<Provider store={mockLoggedInStore}><MyPage /></Provider>);
        const infoButton = screen.getByTestId("button_My Favorites");
        fireEvent.click(infoButton);
        const myInfo = screen.getAllByTestId("spyMyBookmark");
        expect(myInfo).toHaveLength(1);
    });

    it("should handle view My Info modal", () => {
        render(<Provider store={mockLoggedInStore}><MyPage /></Provider>);
        const infoButton = screen.getByTestId("button_Info");
        fireEvent.click(infoButton);
    });

    it("should be redirected if not logged in", () => {
        render(<Provider store={mockLoggedOutStore}><MyPage /></Provider>);
        expect(mockNavigate).toBeCalledWith(-1)
        expect(mockAlert).toBeCalledWith("먼저 로그인 해주세요")
    });
});