import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo, CommentType } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import { getMockStore } from "../test-utils/mock";
import MyComment from "./MyComment";
import { UserInfo } from "../store/slices/user/user";
import { RateInfo } from "../store/slices/rate/rate";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

jest.mock("./Components/ShortComment", () => (prop: CommentType) => (
    <div data-testid={`spyComment_${prop.id}`}>
    </div>
));

const standard_cocktail1_item: CocktailItemType = {
    id: 1,
    name: "ST_COCKTAIL1",
    image: "IMAGE1",
    type: "ST",
    tags: [],
    author_id: null,
    rate: 0,
    is_bookmarked: false,
}

const comment: CommentType = {
    id: 1,
    cocktail: standard_cocktail1_item,
    author_id: 1,
    author_name: "username",
    content: "COMMENT1",
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
    parent_comment: null,
    is_deleted: false
}

const cocktaiState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const commentState: CommentInfo = {
    commentList: [comment],
    commentItem: null,
    state: null,
}

const ingredientState: IngredientInfo = {
    ingredientList: [],
    myIngredientList: [],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
    recommendIngredientList: [],
    availableCocktails: []
}

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
const rateState: RateInfo = {
    rate: { id: 1, user_id: 1, cocktail_id: 1, score: 1 }
}
const mockStore = getMockStore({ cocktail: cocktaiState, ingredient: ingredientState, comment: commentState, user: stubUserInitialState, rate: rateState });

describe("<MyComment />", () => {
    it("should render items without errors", () => {
        render(
            <Provider store={mockStore}>
                <MyComment />
            </Provider>
        );
        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);
        expect(mockDispatch).toBeCalledTimes(1)
    });
});